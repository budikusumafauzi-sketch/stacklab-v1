import { SqlResult } from "../../types/sql";

interface TableViewerProps {
  result: SqlResult;
}

export function TableViewer({ result }: TableViewerProps) {
  if (result.error) {
    return (
      <div className="p-4 text-red-500 bg-red-500/10 font-mono text-sm rounded-md">
        {result.error}
      </div>
    );
  }

  if (result.columns.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground/50 p-4 italic text-sm">
        No results to display. Execute a query to see data.
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-background">
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-sm text-left">
          <thead className="bg-secondary/50 text-muted-foreground uppercase text-xs sticky top-0 z-10">
            <tr>
              {result.columns.map(col => (
                <th key={col.name} className="px-4 py-2 border-b border-border font-medium whitespace-nowrap">
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, i) => (
              <tr key={i} className="hover:bg-secondary/20 border-b border-border/50">
                {result.columns.map(col => (
                  <td key={col.name} className="px-4 py-2 text-foreground whitespace-nowrap">
                    {row[col.name] !== null && row[col.name] !== undefined 
                      ? String(row[col.name]) 
                      : <span className="text-muted-foreground italic">null</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-2 text-xs text-muted-foreground bg-secondary/10 flex justify-between shrink-0 border-t border-border">
        <span>{result.rowCount} row(s) returned</span>
        <span>Execution time: {result.executionTimeMs}ms</span>
      </div>
    </div>
  );
}
