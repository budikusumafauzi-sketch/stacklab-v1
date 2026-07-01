import LabLayout from "../../layouts/LabLayout";
import { LabWorkspace } from "../../components/labs/LabWorkspace";
import { getLabById } from "../../config/labs";
import { StatusBadge } from "../../components/common/StatusBadge";
import { TerminalScreen } from "../../features/linux/components/TerminalScreen";

export default function LinuxLabPage() {
  const metadata = getLabById("linux");

  if (!metadata) return null;

  return (
    <LabLayout
      toolbar={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <metadata.icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                {metadata.title}
                <StatusBadge status={metadata.status} />
              </h2>
              <p className="text-xs text-muted-foreground hidden sm:block">{metadata.description}</p>
            </div>
          </div>
        </div>
      }
      workspace={
        <LabWorkspace className="border-none">
          <TerminalScreen />
        </LabWorkspace>
      }
      statusBar={
        <div className="flex items-center justify-between w-full">
          <span>Disconnected</span>
          <span>v{metadata.version}</span>
        </div>
      }
    />
  );
}
