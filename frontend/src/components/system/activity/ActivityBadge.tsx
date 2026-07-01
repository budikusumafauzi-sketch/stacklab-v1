import { ActivityType } from "../../../services/activity/dispatcher";
import { Badge } from "../../ui/badge";
import { Info, CheckCircle2, AlertTriangle, XCircle, Settings, Bot, Puzzle, ShieldAlert, Folder } from "lucide-react";

export function ActivityBadge({ type }: { type: ActivityType }) {
  switch (type) {
    case ActivityType.SUCCESS:
      return <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Success</Badge>;
    case ActivityType.WARNING:
      return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"><AlertTriangle className="w-3 h-3 mr-1" /> Warning</Badge>;
    case ActivityType.ERROR:
      return <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20"><XCircle className="w-3 h-3 mr-1" /> Error</Badge>;
    case ActivityType.SYSTEM:
      return <Badge variant="outline" className="text-gray-500"><Settings className="w-3 h-3 mr-1" /> System</Badge>;
    case ActivityType.AI:
      return <Badge variant="outline" className="text-purple-500 border-purple-500/20"><Bot className="w-3 h-3 mr-1" /> AI</Badge>;
    case ActivityType.PLUGIN:
      return <Badge variant="outline" className="text-blue-500 border-blue-500/20"><Puzzle className="w-3 h-3 mr-1" /> Plugin</Badge>;
    case ActivityType.SECURITY:
      return <Badge variant="outline" className="text-orange-500 border-orange-500/20"><ShieldAlert className="w-3 h-3 mr-1" /> Security</Badge>;
    case ActivityType.WORKSPACE:
      return <Badge variant="outline" className="text-cyan-500 border-cyan-500/20"><Folder className="w-3 h-3 mr-1" /> Workspace</Badge>;
    default:
      return <Badge variant="secondary" className="text-blue-500 bg-blue-500/10"><Info className="w-3 h-3 mr-1" /> Info</Badge>;
  }
}
