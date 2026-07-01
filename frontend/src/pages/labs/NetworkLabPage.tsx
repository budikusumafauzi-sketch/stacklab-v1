import LabLayout from "../../layouts/LabLayout";
import { LabWorkspace } from "../../components/labs/LabWorkspace";
import { getLabById } from "../../config/labs";
import { StatusBadge } from "../../components/common/StatusBadge";
import { SubnetCalculator } from "../../features/network/components/SubnetCalculator";
import { IpConverter } from "../../features/network/components/IpConverter";
import { PingSimulator } from "../../features/network/components/PingSimulator";

export default function NetworkLabPage() {
  const metadata = getLabById("network");

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
      leftPanel={
        <div className="p-4 space-y-6 overflow-y-auto h-full">
          <SubnetCalculator />
          <IpConverter />
        </div>
      }
      workspace={
        <LabWorkspace className="border-none">
          <PingSimulator />
        </LabWorkspace>
      }
      statusBar={
        <div className="flex items-center justify-between w-full">
          <span>Ready</span>
          <span>v{metadata.version}</span>
        </div>
      }
    />
  );
}
