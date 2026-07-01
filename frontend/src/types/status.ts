import { STATUSES } from "../constants/status";

export type SystemStatus = typeof STATUSES[keyof typeof STATUSES];
