import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(key);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const body = await request.json();
    const { moduleId, type = "module" } = body;

    if (!moduleId) {
      return NextResponse.json({ error: "Module ID requis" }, { status: 400 });
    }

    // Get module details from database
    const { data: moduleData, error: moduleError } = await supabase
      .from("modules")
      .select("*")
      .eq("id", moduleId)
      .single();

    const moduleInfo = moduleData as { id: string; title: string; description: string | null; price_cents: number } | null;

    if (moduleError || !moduleInfo) {
      return NextResponse.json({ error: "Module non trouve" }, { status: 404 });
    }

    // Get user profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("email, first_name, last_name")
      .eq("id", user.id)
      .single();

    const profile = profileData as { email: string; first_name: string; last_name: string } | null;

    // Create Stripe Checkout session
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: profile?.email || user.email || "",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: moduleInfo.title,
              description: moduleInfo.description || `Module de formation Neo-Coaching`,
              images: [], // Add module image if available
            },
            unit_amount: moduleInfo.price_cents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.id,
        module_id: moduleId,
        type: type,
      },
      success_url: `${request.nextUrl.origin}/coaching/modules/${moduleId}?success=true`,
      cancel_url: `${request.nextUrl.origin}/coaching/modules?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation du paiement" },
      { status: 500 }
    );
  }
}
