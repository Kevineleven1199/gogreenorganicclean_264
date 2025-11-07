import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./src/lib/auth/token";

type AllowedRole = "HQ" | "CLEANER" | "CUSTOMER";

const roleRequirements: Array<{ prefix: string; roles: AllowedRole[] }> = [
  { prefix: "/admin", roles: ["HQ"] },
  { prefix: "/api/admin", roles: ["HQ"] },
  { prefix: "/cleaner", roles: ["CLEANER", "HQ"] },
  { prefix: "/api/cleaner", roles: ["CLEANER", "HQ"] },
  { prefix: "/client", roles: ["CUSTOMER", "HQ"] }
];

const getRequiredRoles = (pathname: string) => {
  const match = roleRequirements.find((item) => pathname === item.prefix || pathname.startsWith(`${item.prefix}/`));
  return match?.roles;
};

export async function middleware(request: NextRequest) {
  const requiredRoles = getRequiredRoles(request.nextUrl.pathname);

  if (requiredRoles) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySessionToken(token);

    if (!session || !requiredRoles.includes(session.role)) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  const response = NextResponse.next();
  const host = request.headers.get("host") ?? "";
  const [subdomain] = host.split(".");

  const pathSegments = request.nextUrl.pathname.split("/").filter(Boolean);
  const pathTenant = pathSegments.length > 0 ? pathSegments[0] : null;

  const tenantSlug = (() => {
    if (pathTenant && !pathTenant.startsWith("api")) {
      return pathTenant;
    }
    if (subdomain && !["www", "app", "localhost", "127"].includes(subdomain)) {
      return subdomain;
    }
    return "gogreen";
  })();

  response.headers.set("x-tenant-slug", tenantSlug);
  return response;
}

export const config = {
  matcher: ["/((?!_next|static|.*\..*).*)"]
};
