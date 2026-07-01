import { getDb } from "./mock-engine";

export interface SchemaColumn {
  name: string;
  type: string;
}

export interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
  rowCount: number;
}

export const getMockSchema = (): SchemaTable[] => {
  const db = getDb();
  return Object.entries(db).map(([tableName, data]) => {
    const columns = data.length > 0 ? Object.keys(data[0]).map(key => {
      const row = data[0] as Record<string, unknown>;
      return {
        name: key,
        type: typeof row[key] === "number" ? "integer" : 
              typeof row[key] === "boolean" ? "boolean" : "varchar"
      };
    }) : [];
    
    return {
      name: tableName,
      columns,
      rowCount: data.length
    };
  });
};
