import { useState, useMemo } from "react";
import { computeJsonDiff } from "../utils/diff";

export function DiffViewer({ currentJson }: { currentJson: string }) {
  const [oldJson, setOldJson] = useState('{\n  "example": "old value"\n}');
  
  const diffLines = useMemo(() => {
    return computeJsonDiff(oldJson, currentJson);
  }, [oldJson, currentJson]);

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded">
      <div className="p-2 border-b border-border bg-secondary/20">
        <textarea 
          className="w-full h-16 p-2 bg-background border border-border rounded text-xs font-mono resize-none focus:outline-none focus:border-primary"
          placeholder="Paste original JSON here to compare..."
          value={oldJson}
          onChange={(e) => setOldJson(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {diffLines.length === 0 && <div className="text-muted-foreground italic text-xs">No differences or invalid JSON.</div>}
        {diffLines.map((line, idx) => (
          <div key={idx} className={`flex px-2 py-0.5 ${
            line.type === 'added' ? 'bg-green-500/10 text-green-500' :
            line.type === 'removed' ? 'bg-red-500/10 text-red-500 line-through opacity-70' :
            'text-muted-foreground'
          }`}>
            <span className="w-8 text-right pr-4 opacity-50 text-xs select-none">{line.lineNum || '-'}</span>
            <span className="whitespace-pre">{line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  '}{line.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
