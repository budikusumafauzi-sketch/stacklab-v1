export interface SqlQuery {
  text: string;
}

export interface SqlColumn {
  name: string;
  type: "string" | "number" | "boolean" | "date";
}

export interface SqlResult {
  columns: SqlColumn[];
  rows: Record<string, unknown>[];
  executionTimeMs: number;
  rowCount: number;
  error?: string;
  message?: string;
}
