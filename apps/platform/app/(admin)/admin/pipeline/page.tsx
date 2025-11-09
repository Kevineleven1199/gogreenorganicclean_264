import PipelineBoard from "@/src/components/pipeline/PipelineBoard";
import { requireSession } from "@/src/lib/auth/session";
import { getPipelineBoardData } from "@/src/lib/pipeline";

const AdminPipelinePage = async () => {
  const session = await requireSession({ roles: ["HQ"], redirectTo: "/admin/pipeline" });
  const board = await getPipelineBoardData(session);

  return (
    <div className="space-y-8">
      <PipelineBoard {...board} />
    </div>
  );
};

export default AdminPipelinePage;
