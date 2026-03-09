import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(key);
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase credentials not configured");
  }
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const { user_id, module_id, type } = session.metadata || {};

      if (!user_id || !module_id) {
        console.error("Missing metadata in session:", session.id);
        break;
      }

      // Record the payment
      const { error: paymentError } = await supabaseAdmin.from("payments").insert({
        user_id,
        amount_cents: session.amount_total || 0,
        type: type === "intervenant_session" ? "intervenant_session" : "module",
        stripe_payment_id: session.payment_intent as string,
        status: "succeeded",
        module_id: type === "module" ? module_id : null,
        intervenant_id: type === "intervenant_session" ? module_id : null,
      });

      if (paymentError) {
        console.error("Error recording payment:", paymentError);
      }

      // If it's a module purchase, create module_progress entry
      if (type === "module" || !type) {
        const { error: progressError } = await supabaseAdmin
          .from("module_progress")
          .insert({
            user_id,
            module_id,
            status: "not_started",
          });

        if (progressError) {
          console.error("Error creating module progress:", progressError);
        }

        // Create notification for user
        await supabaseAdmin.from("notifications").insert({
          user_id,
          type: "module_complete",
          title: "Module achete !",
          body: "Votre module est pret. Commencez des maintenant !",
          link: `/coaching/modules/${module_id}`,
        });
      }

      console.log(`Payment succeeded for user ${user_id}, module ${module_id}`);
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.error("Payment failed:", paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
