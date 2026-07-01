import { useState, useEffect, useCallback } from "react";
import LabLayout from "../../layouts/LabLayout";
import { LabWorkspace } from "../../components/labs/LabWorkspace";
import { getLabById } from "../../config/labs";
import { StatusBadge } from "../../components/common/StatusBadge";
import { CodeEditor } from "../../components/editor/CodeEditor";
import { ResponseViewer } from "../../components/viewer/ResponseViewer";
import { Toolbar, ToolbarGroup, ToolbarButton, ToolbarDivider } from "../../components/ui/toolbar";
import { Send, Eraser, Download, Settings2 } from "../../config/icons";
import { apiClient } from "../../services/api/client";
import { ApiRequest, ApiResponse, HttpMethod } from "../../types/api";
import { fileService } from "../../services/file";
import { commandRegistry } from "../../commands/registry";
import { shortcutManager } from "../../services/shortcuts";
import { apiHistory } from "../../services/history";
import { ApiSidebar } from "../../features/api/components/ApiSidebar";

export default function ApiLabPage() {
  const metadata = getLabById("api");
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/todos/1");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleSend = useCallback(async () => {
    setIsSending(true);
    const request: ApiRequest = {
      method,
      url,
      headers: [],
      params: [],
      body: method === "GET" || method === "HEAD" ? "" : body,
      bodyType: "json"
    };

    const res = await apiClient.send(request);
    setResponse(res);
    apiHistory.add({ request, response: res });
    setIsSending(false);
  }, [method, url, body]);

  const handleClear = () => {
    setBody("");
    setResponse(null);
  };

  const handleExport = () => {
    if (response) {
      fileService.download(response.body, "response.json");
    }
  };

  useEffect(() => {
    const unregister = shortcutManager.register({
      key: "Enter",
      ctrlKey: true,
      handler: handleSend
    });
    return () => unregister();
  }, [handleSend]);

  commandRegistry.register({
    id: "api.send",
    name: "Send Request",
    execute: handleSend
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
                <ToolbarButton onClick={() => commandRegistry.execute("api.send")} disabled={isSending}>
                  <Send className="w-4 h-4 mr-2 text-primary" />
                  Send
                </ToolbarButton>
                <ToolbarButton onClick={handleClear}>
                  <Eraser className="w-4 h-4 mr-2" />
                  Clear
                </ToolbarButton>
              </ToolbarGroup>
              <ToolbarDivider />
              <ToolbarGroup>
                <ToolbarButton onClick={handleExport} disabled={!response}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </ToolbarButton>
              </ToolbarGroup>
            </Toolbar>
          </div>
        </div>
      }
      leftPanel={<ApiSidebar />}
      workspace={
        <div className="flex flex-col h-full space-y-4">
          <LabWorkspace className="flex flex-col shrink-0 h-[45%]">
            <div className="flex items-center p-2 border-b border-border bg-secondary/30 space-x-2">
              <select 
                className="bg-secondary border border-border rounded-md px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:border-primary"
                value={method}
                onChange={(e) => setMethod(e.target.value as HttpMethod)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input 
                type="text" 
                className="flex-1 bg-muted border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
                placeholder="https://api.example.com/endpoint"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.ctrlKey && handleSend()}
              />
            </div>
            <div className="h-10 border-b border-border flex items-center px-4 bg-secondary/20 shrink-0">
              <Settings2 className="w-4 h-4 mr-2 text-primary" />
              <span className="text-xs font-semibold text-foreground">Request Body (JSON)</span>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <CodeEditor
                config={{ language: "json", minimap: false }}
                value={body}
                onChange={(val) => setBody(val || "")}
                options={{ readOnly: method === "GET" || method === "HEAD" }}
              />
              {(method === "GET" || method === "HEAD") && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center pointer-events-none">
                  <span className="text-muted-foreground font-medium">Body is disabled for {method} requests</span>
                </div>
              )}
            </div>
          </LabWorkspace>
          
          <LabWorkspace className="flex flex-col flex-1">
            <ResponseViewer response={response} />
          </LabWorkspace>
        </div>
      }
      statusBar={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <span className={response?.status && response.status >= 400 ? "text-red-400 font-medium" : "text-green-500 font-medium"}>
              {isSending ? "Sending..." : response ? "Response Received" : "Ready"}
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
