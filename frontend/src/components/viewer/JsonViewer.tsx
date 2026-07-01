import { TreeViewer } from "./TreeViewer";

interface JsonViewerProps {
  data: unknown;
  error?: string;
}

export function JsonViewer({ data, error }: JsonViewerProps) {
  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400 p-4 font-mono text-sm bg-red-500/10 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-auto h-full">
      <TreeViewer data={data} />
    </div>
  );
}
