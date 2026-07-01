
import { useParams } from "react-router-dom";

export default function WorkspacePage() {
  const { workspaceId } = useParams();

  return (
    <div className="flex h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Workspace Area</h1>
        <p className="text-muted-foreground text-lg mb-8">
          You are currently in workspace ID: {workspaceId}
        </p>
      </div>
    </div>
  );
}
