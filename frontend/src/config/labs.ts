import { ElementType } from "react";
import { Database, Network, Webhook, Terminal, FileJson } from "./icons";
import { SystemStatus } from "../types/status";
import { STATUSES } from "../constants/status";

export interface LabMetadata {
  id: string;
  title: string;
  description: string;
  icon: ElementType;
  version: string;
  status: SystemStatus;
  available: boolean;
  path: string;
}

export const labsConfig: LabMetadata[] = [
  {
    id: "sql",
    title: "SQL Lab",
    description: "Write, test, and format SQL queries in a sandboxed database environment.",
    icon: Database,
    version: "1.0.0",
    status: STATUSES.AVAILABLE,
    available: true,
    path: "/labs/sql",
  },
  {
    id: "network",
    title: "Network Lab",
    description: "Analyze network configurations, ping, and traceroute utilities.",
    icon: Network,
    version: "1.0.0",
    status: STATUSES.BETA,
    available: true,
    path: "/labs/network",
  },
  {
    id: "api",
    title: "API Lab",
    description: "Construct and test REST and GraphQL API requests.",
    icon: Webhook,
    version: "1.0.0",
    status: STATUSES.AVAILABLE,
    available: true,
    path: "/labs/api",
  },
  {
    id: "linux",
    title: "Linux Lab",
    description: "Experiment with Linux commands in a virtualized terminal.",
    icon: Terminal,
    version: "1.0.0",
    status: STATUSES.BETA,
    available: true,
    path: "/labs/linux",
  },
  {
    id: "json",
    title: "JSON Lab",
    description: "Format, validate, and manipulate JSON data structures.",
    icon: FileJson,
    version: "1.0.0",
    status: STATUSES.AVAILABLE,
    available: true,
    path: "/labs/json",
  },
];

export function getLabById(id: string): LabMetadata | undefined {
  return labsConfig.find((lab) => lab.id === id);
}
