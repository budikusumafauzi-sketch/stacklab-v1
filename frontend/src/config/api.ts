import { env } from "./env";

export const API_CONFIG = {
  BASE_URL: env.VITE_API_URL,
  TIMEOUT: 10000,
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  ENDPOINTS: {
    HEALTH: "/api/health",
  },
  RETRY_COUNT: 3,
} as const;
