import { getMockSchema } from "../engine/mockDb";

export function SchemaExplorer() {
  const schema = getMockSchema();

  return (
    <div className="flex flex-col h-full overflow-y-auto space-y-4 p-4">
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-4">Database Schema</h3>
        <div className="space-y-4">
          {schema.map(table => (
            <div key={table.name} className="bg-background border border-border rounded overflow-hidden">
              <div className="bg-secondary/20 p-2 border-b border-border flex justify-between items-center">
                <span className="font-medium text-sm text-foreground">{table.name}</span>
                <span className="text-xs text-muted-foreground">{table.rowCount} rows</span>
              </div>
              <div className="p-2 space-y-1">
                {table.columns.map(col => (
                  <div key={col.name} className="flex justify-between items-center text-xs">
                    <span className="text-primary">{col.name}</span>
                    <span className="text-muted-foreground font-mono">{col.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
