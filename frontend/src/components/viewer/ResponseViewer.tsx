import { ApiResponse } from "../../types/api";
import { JsonViewer } from "./JsonViewer";
import { RawViewer } from "./RawViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface ResponseViewerProps {
  response: ApiResponse | null;
}

export function ResponseViewer({ response }: ResponseViewerProps) {
  if (!response) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground/50 p-4 italic text-sm">
        Send a request to view the response.
      </div>
    );
  }

  const isJson = response.headers["content-type"]?.includes("application/json");
  let parsedJson = null;
  let jsonError = "";

  if (isJson && response.body) {
    try {
      parsedJson = JSON.parse(response.body);
    } catch {
      jsonError = "Failed to parse JSON response";
    }
  }

  const statusColor = response.status >= 200 && response.status < 300 ? "text-green-500" :
                      response.status >= 400 ? "text-red-500" : "text-yellow-500";

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center space-x-4 p-2 border-b border-border bg-secondary/30 shrink-0">
        <span className={`text-sm font-bold px-2 py-1 rounded bg-secondary ${statusColor}`}>
          {response.status} {response.statusText}
        </span>
        <span className="text-xs text-muted-foreground">{response.timeMs} ms</span>
        <span className="text-xs text-muted-foreground">{(response.sizeBytes / 1024).toFixed(2)} KB</span>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue={isJson && !jsonError ? "json" : "raw"} className="w-full h-full flex flex-col">
          <div className="px-2 pt-2 border-b border-border shrink-0">
            <TabsList>
              <TabsTrigger value="json" disabled={!isJson}>JSON</TabsTrigger>
              <TabsTrigger value="raw">Raw</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <TabsContent value="json" className="absolute inset-0 m-0 border-0 outline-none">
              <JsonViewer data={parsedJson} error={jsonError} />
            </TabsContent>
            <TabsContent value="raw" className="absolute inset-0 m-0 border-0 outline-none">
              <RawViewer content={response.body} language={isJson ? "json" : "plaintext"} />
            </TabsContent>
            <TabsContent value="headers" className="absolute inset-0 m-0 overflow-auto p-4 border-0 outline-none">
              <table className="w-full text-sm text-left">
                <tbody>
                  {Object.entries(response.headers).map(([key, value]) => (
                    <tr key={key} className="border-b border-border/50">
                      <td className="py-2 pr-4 font-medium text-foreground">{key}</td>
                      <td className="py-2 text-muted-foreground break-all">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
