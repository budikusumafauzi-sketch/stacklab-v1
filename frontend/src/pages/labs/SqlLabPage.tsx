import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import LabLayout from "../../layouts/LabLayout";
import { LabWorkspace } from "../../components/labs/LabWorkspace";
import { getLabById } from "../../config/labs";
import { StatusBadge } from "../../components/common/StatusBadge";
import { CodeEditor } from "../../components/editor/CodeEditor";
import { TableViewer } from "../../components/viewer/TableViewer";
import { Toolbar, ToolbarGroup, ToolbarButton, ToolbarDivider } from "../../components/ui/toolbar";
import { Play, Eraser, Download, Database, LayoutGrid, RotateCcw } from "../../config/icons";
import { mockSqlEngine } from "../../features/sql/engine/mock-engine";
import { SqlResult } from "../../types/sql";
import { fileService } from "../../services/file";
import { commandRegistry } from "../../commands/registry";
import { shortcutManager } from "../../services/shortcuts";
import { sqlHistory } from "../../services/history";
import { SchemaExplorer } from "../../features/sql/components/SchemaExplorer";

export default function SqlLabPage() {
  const metadata = getLabById("sql");
  const [query, setQuery] = useState("SELECT * FROM users;");
  const [result, setResult] = useState<SqlResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = useCallback(async () => {
    setIsExecuting(true);
    const res = await mockSqlEngine.execute({ text: query });
    setResult(res);
    sqlHistory.add({ query, result: res });
    
    if (res.message) {
      toast.success(res.message);
    }
    
    setIsExecuting(false);
  }, [query]);

  const handleClear = () => {
    setQuery("");
    setResult(null);
  };

  const handleResetDb = () => {
    mockSqlEngine.reset();
    toast.success("Database reset to initial state");
    setResult(null);
  };

  const handleExport = () => {
    if (result && result.rows.length > 0) {
      fileService.download(JSON.stringify(result.rows, null, 2), "sql_export.json");
    }
  };

  useEffect(() => {
    const unregister = shortcutManager.register({
      key: "Enter",
      ctrlKey: true,
      handler: handleExecute
    });
    return () => unregister();
  }, [handleExecute]);

  commandRegistry.register({
    id: "sql.execute",
    name: "Execute",
    execute: handleExecute
  });

  if (!metadata) return null;

  return (
    <LabLayout
      toolbar={
        <div className="flex items-center justify-between w-full pr-2">
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
          <div className="flex items-center">
            <Toolbar>
              <ToolbarGroup>
                <ToolbarButton onClick={() => commandRegistry.execute("sql.execute")} disabled={isExecuting}>
                  <Play className="w-4 h-4 mr-2 text-green-500" />
                  Execute
                </ToolbarButton>
                <ToolbarButton onClick={handleClear}>
                  <Eraser className="w-4 h-4 mr-2" />
                  Clear
                </ToolbarButton>
                <ToolbarButton onClick={handleResetDb}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset DB
                </ToolbarButton>
              </ToolbarGroup>
              <ToolbarDivider />
              <ToolbarGroup>
                <ToolbarButton onClick={handleExport} disabled={!result || result.rows.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </ToolbarButton>
              </ToolbarGroup>
            </Toolbar>
          </div>
        </div>
      }
      leftPanel={<SchemaExplorer />}
      workspace={
        <div className="grid grid-rows-2 gap-4 h-full">
          <LabWorkspace className="flex flex-col">
            <div className="h-10 border-b border-border flex items-center px-4 bg-secondary/20 shrink-0">
              <Database className="w-4 h-4 mr-2 text-primary" />
              <span className="text-xs font-semibold text-foreground">Query Editor</span>
              <span className="ml-auto text-xs text-muted-foreground">Mock DB: users, products, orders</span>
            </div>
            <CodeEditor
              config={{ language: "sql", minimap: false }}
              value={query}
              onChange={(val) => setQuery(val || "")}
            />
          </LabWorkspace>
          
          <LabWorkspace className="flex flex-col">
            <div className="h-10 border-b border-border flex items-center px-4 bg-secondary/20 shrink-0">
              <LayoutGrid className="w-4 h-4 mr-2 text-primary" />
              <span className="text-xs font-semibold text-foreground">Results</span>
            </div>
            <div className="flex-1 overflow-hidden">
              {result ? (
                <TableViewer result={result} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground/50 italic text-sm">
                  Run a query to see results. (Ctrl + Enter)
                </div>
              )}
            </div>
          </LabWorkspace>
        </div>
      }
      statusBar={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <span className={result?.error ? "text-red-400 font-medium" : "text-green-500 font-medium"}>
              {isExecuting ? "Executing..." : result?.error ? "Query Error" : "Ready"}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-muted-foreground">
             <span>v{metadata.version}</span>
          </div>
        </div>
      }
    />
  );
}
