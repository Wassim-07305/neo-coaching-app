import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Skip auth check if Supabase is not configured (demo mode)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("placeholder")) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public routes that don't require auth
  const publicPaths = ["/", "/connexion", "/reserver", "/intervenants", "/blog"];
  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith("/intervenants") || request.nextUrl.pathname.startsWith("/blog")
  );

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    return NextResponse.redirect(url);
  }

  // Role-based routing
  const dashboardMap: Record<string, string> = {
    admin: "/admin/dashboard",
    dirigeant: "/dirigeant/dashboard",
    salarie: "/salarie/dashboard",
    coachee: "/coaching/dashboard",
    intervenant: "/intervenants",
  };

  // Role → allowed route prefixes
  const roleRoutes: Record<string, string[]> = {
    admin: ["/admin", "/notifications", "/onboarding"],
    dirigeant: ["/dirigeant", "/notifications", "/onboarding"],
    salarie: ["/salarie", "/notifications", "/onboarding"],
    coachee: ["/coaching", "/notifications", "/onboarding"],
    intervenant: ["/intervenants"],
  };

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "coachee";

    // Redirect from /connexion to dashboard
    if (request.nextUrl.pathname === "/connexion") {
      const url = request.nextUrl.clone();
      url.pathname = dashboardMap[role] || "/";
      return NextResponse.redirect(url);
    }

    // Block access to routes not allowed for this role
    const pathname = request.nextUrl.pathname;
    const allowedPrefixes = roleRoutes[role] || ["/coaching"];
    const isAppRoute = pathname.startsWith("/admin") ||
      pathname.startsWith("/dirigeant") ||
      pathname.startsWith("/salarie") ||
      pathname.startsWith("/coaching");

    if (isAppRoute) {
      const hasAccess = allowedPrefixes.some((prefix) => pathname.startsWith(prefix));
      if (!hasAccess) {
        const url = request.nextUrl.clone();
        url.pathname = dashboardMap[role] || "/";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
