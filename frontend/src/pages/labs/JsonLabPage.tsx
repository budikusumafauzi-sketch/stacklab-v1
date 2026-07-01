import { useState, useEffect, useCallback } from "react";
import LabLayout from "../../layouts/LabLayout";
import { LabWorkspace } from "../../components/labs/LabWorkspace";
import { getLabById } from "../../config/labs";
import { StatusBadge } from "../../components/common/StatusBadge";
import { CodeEditor } from "../../components/editor/CodeEditor";
import { JsonViewer } from "../../components/viewer/JsonViewer";
import { Toolbar, ToolbarGroup, ToolbarButton, ToolbarDivider } from "../../components/ui/toolbar";
import { FileJson, Wand2, Minimize2, CheckCircle2, Copy, Trash2, Download, Upload } from "../../config/icons";
import { DiffViewer } from "../../features/json/components/DiffViewer";
import { formatJson, minifyJson } from "../../features/json/utils/json";
import { validationProvider } from "../../providers/validation";
import { EditorError } from "../../lib/errors";
import { fileService } from "../../services/file";
import { clipboard } from "../../services/clipboard";
import { commandRegistry } from "../../commands/registry";
import { shortcutManager } from "../../services/shortcuts";

enum ViewMode {
  RAW = 'RAW',
  TREE = 'TREE',
  DIFF = 'DIFF'
}

export default function JsonLabPage() {
  const metadata = getLabById("json");
  const [inputJson, setInputJson] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.TREE);
  const [error, setError] = useState<EditorError | null>(null);
  


  const handleValidate = useCallback(() => {
    const result = validationProvider.json(inputJson);
    if (!result.valid && result.error) {
      setError(result.error);
    } else {
      setError(null);
    }
  }, [inputJson]);

  const handleFormat = useCallback(() => {
    try {
      const formatted = formatJson(inputJson);
      setInputJson(formatted);
      setError(null);
    } catch {
      handleValidate();
    }
  }, [inputJson, handleValidate]);

  const handleMinify = useCallback(() => {
    try {
      const minified = minifyJson(inputJson);
      setInputJson(minified);
      setError(null);
    } catch {
      handleValidate();
    }
  }, [inputJson, handleValidate]);

  const handleCopy = () => {
    clipboard.copy(inputJson);
  };

  const handleClear = () => {
    setInputJson("");
    setError(null);
  };

  const handleDownload = () => {
    fileService.download(inputJson, "stacklab-export.json");
  };

  const handleUpload = async () => {
    try {
      const content = await fileService.upload(".json");
      setInputJson(content);
      setError(null);
    } catch {
      // ignore empty selections
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    setInputJson(value || "");
    if (error) {
      const result = validationProvider.json(value || "");
      if (result.valid) setError(null);
    }
  };

  useEffect(() => {
    const unregister = shortcutManager.register({
      key: "s",
      ctrlKey: true,
      handler: handleFormat
    });
    return () => unregister();
  }, [handleFormat]);

  // Register commands
  commandRegistry.register({ id: "json.format", name: "Format", execute: handleFormat });
  commandRegistry.register({ id: "json.minify", name: "Minify", execute: handleMinify });
  commandRegistry.register({ id: "json.validate", name: "Validate", execute: handleValidate });

  let parsedData = null;
  if (viewMode === ViewMode.TREE && inputJson.trim()) {
    try {
      parsedData = JSON.parse(inputJson);
    } catch {
      // Cannot parse for tree view
    }
  }

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
                <ToolbarButton onClick={() => commandRegistry.execute("json.format")} title="Format (Ctrl+S)">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Format
                </ToolbarButton>
                <ToolbarButton onClick={() => commandRegistry.execute("json.minify")}>
                  <Minimize2 className="w-4 h-4 mr-2" />
                  Minify
                </ToolbarButton>
                <ToolbarButton onClick={() => commandRegistry.execute("json.validate")}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Validate
                </ToolbarButton>
              </ToolbarGroup>
              <ToolbarDivider />
              <ToolbarGroup>
                <ToolbarButton onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </ToolbarButton>
                <ToolbarButton onClick={handleClear}>
                  <Trash2 className="w-4 h-4 mr-2 text-red-400" />
                  Clear
                </ToolbarButton>
              </ToolbarGroup>
              <ToolbarDivider />
              <ToolbarGroup>
                <ToolbarButton onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </ToolbarButton>
                <ToolbarButton onClick={handleUpload}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </ToolbarButton>
              </ToolbarGroup>
            </Toolbar>
          </div>
        </div>
      }
      workspace={
        <div className="grid grid-cols-2 gap-4 h-full">
          <LabWorkspace className="flex flex-col">
            <div className="h-10 border-b border-border flex items-center px-4 bg-secondary/20 shrink-0">
              <FileJson className="w-4 h-4 mr-2 text-primary" />
              <span className="text-xs font-semibold text-foreground">Input</span>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <CodeEditor
                config={{ language: "json", minimap: false }}
                value={inputJson}
                onChange={handleEditorChange}
              />
              {error && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-500/10 border border-red-500/50 text-red-500 px-3 py-2 rounded-md text-sm shadow-md z-10">
                  <span className="font-bold">Error:</span> {error.message}
                  {error.line && ` (Line ${error.line}, Column ${error.column})`}
                </div>
              )}
            </div>
          </LabWorkspace>
          
          <LabWorkspace className="flex flex-col bg-background">
            <div className="h-10 border-b border-border flex items-center px-2 space-x-2 shrink-0 bg-secondary/20">
              <button 
                className={`text-xs px-3 py-1 rounded-md font-medium transition-colors ${viewMode === ViewMode.TREE ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
                onClick={() => setViewMode(ViewMode.TREE)}
              >
                Tree View
              </button>
              <button 
                className={`text-xs px-3 py-1 rounded-md font-medium transition-colors ${viewMode === ViewMode.RAW ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
                onClick={() => setViewMode(ViewMode.RAW)}
              >
                Raw View
              </button>
              <button 
                className={`text-xs px-3 py-1 rounded-md font-medium transition-colors ${viewMode === ViewMode.DIFF ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
                onClick={() => setViewMode(ViewMode.DIFF)}
              >
                Diff View
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden relative">
              {!inputJson.trim() ? (
                <div className="flex items-center justify-center h-full text-muted-foreground/50 text-sm italic">
                  <p>Output will appear here</p>
                </div>
              ) : viewMode === ViewMode.TREE ? (
                <JsonViewer data={parsedData} error={parsedData === null ? "Invalid JSON" : undefined} />
              ) : viewMode === ViewMode.DIFF ? (
                <DiffViewer currentJson={inputJson} />
              ) : (
                <CodeEditor
                  config={{ language: "json", readOnly: true, lineNumbers: "off", minimap: false }}
                  value={inputJson}
                />
              )}
            </div>
          </LabWorkspace>
        </div>
      }
      statusBar={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
             <span className={error ? "text-red-400 font-medium" : (inputJson ? "text-green-500 font-medium" : "text-muted-foreground")}>
               {error ? 'Invalid JSON' : (inputJson ? 'Valid JSON' : 'Ready')}
             </span>
          </div>
          <div className="flex items-center space-x-4">
            {inputJson && <span>{inputJson.length} bytes</span>}
            <span>v{metadata.version}</span>
          </div>
        </div>
      }
    />
  );
}
