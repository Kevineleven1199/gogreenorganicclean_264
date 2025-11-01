import { redirect } from "next/navigation";

type TenantRootPageProps = {
  params: {
    tenantSlug: string;
  };
};

const TenantRootPage = ({ params }: TenantRootPageProps) => {
  redirect(`/${params.tenantSlug}/dashboard`);
};

export default TenantRootPage;
