import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const getTenantFromRequest = async (slug?: string) => {
  const requestHeaders = await headers();
  const headerSlug = requestHeaders.get("x-tenant-slug") ?? undefined;
  const effectiveSlug = slug ?? headerSlug ?? "gogreen";

  return prisma.tenant.findUnique({
    where: {
      slug: effectiveSlug
    }
  });
};

export const getTenantByDomain = async (host: string) => {
  const [subdomain] = host.split(".");
  if (!subdomain || ["www", "app"].includes(subdomain)) {
    return prisma.tenant.findUnique({
      where: { slug: "gogreen" }
    });
  }

  const tenant = await prisma.tenant.findFirst({
    where: {
      OR: [{ slug: subdomain }, { customDomain: host }]
    }
  });

  return tenant ?? prisma.tenant.findUnique({ where: { slug: "gogreen" } });
};
