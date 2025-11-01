import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
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
