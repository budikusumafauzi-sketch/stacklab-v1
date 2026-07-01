import { useState, useEffect } from "react";
import { SystemStatus } from "../types/status";
import { API_CONFIG } from "../config/api";

interface SystemHealth {
  frontend: SystemStatus;
  backend: SystemStatus;
  api: SystemStatus;
  labs: SystemStatus;
}

export function useSystemStatus(): SystemHealth {
  const [health, setHealth] = useState<SystemHealth>({
    frontend: "operational",
    backend: "connecting",
    api: "connecting",
    labs: "operational"
  });

  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
          signal: AbortSignal.timeout(5000)
        });
        if (response.ok) {
          setHealth(prev => ({ ...prev, backend: "operational", api: "operational" }));
        } else {
          setHealth(prev => ({ ...prev, backend: "degraded", api: "degraded" }));
        }
      } catch {
        setHealth(prev => ({ ...prev, backend: "offline", api: "offline" }));
      }
    }
    
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return health;
}
