import { useState, useEffect } from "react";
import { collectionsManager } from "../collections/manager";
import { environmentManager } from "../environments/manager";
import { ApiCollection, ApiEnvironment } from "../types";
import { Button } from "../../../components/ui/button";

export function ApiSidebar() {
  const [collections, setCollections] = useState<ApiCollection[]>([]);
  const [env, setEnv] = useState<ApiEnvironment>(environmentManager.getActiveEnvironment());
  
  useEffect(() => {
    const unsubCol = collectionsManager.subscribe(() => {
      setCollections(collectionsManager.getCollections());
    });
    const unsubEnv = environmentManager.subscribe(() => {
      setEnv(environmentManager.getActiveEnvironment());
    });
    return () => { unsubCol(); unsubEnv(); };
  }, []);

  return (
    <div className="flex flex-col h-full overflow-y-auto space-y-6 p-4">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase">Collections</h3>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => collectionsManager.addCollection("New Collection")}>+ New</Button>
        </div>
        <div className="space-y-2">
          {collections.length === 0 ? (
            <p className="text-xs text-muted-foreground">No collections yet.</p>
          ) : collections.map(c => (
            <div key={c.id} className="p-2 text-sm bg-background border border-border rounded flex justify-between items-start">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.requests.length} requests</div>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive shrink-0" onClick={() => collectionsManager.removeCollection(c.id)}>×</Button>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase">Environment</h3>
        </div>
        <div className="space-y-2">
           <div className="text-sm font-medium mb-1">Active: {env.name}</div>
           {Object.entries(env.variables).map(([k, v]) => (
             <div key={k} className="flex flex-col gap-1 mb-2 bg-secondary/20 p-2 rounded">
               <span className="text-xs font-semibold text-primary">{k}</span>
               <span className="text-xs font-mono text-muted-foreground truncate">{v}</span>
             </div>
           ))}
           <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => environmentManager.setVariable(env.id, "host", "https://api.github.com")}>
             Set Test Var
           </Button>
        </div>
      </div>
    </div>
  );
}
