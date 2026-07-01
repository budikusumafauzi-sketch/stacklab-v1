import { SqlQuery, SqlResult, SqlColumn } from "../../../types/sql";
import { SAMPLE_DATABASE } from "./sample-data";

type DbType = Record<string, Record<string, any>[]>;

let dbState: DbType = JSON.parse(JSON.stringify(SAMPLE_DATABASE));

export const getDb = () => dbState;

function parseValue(v: string): any {
  v = v.trim();
  if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1);
  if (v.startsWith('"') && v.endsWith('"')) return v.slice(1, -1);
  if (v.toLowerCase() === 'true') return true;
  if (v.toLowerCase() === 'false') return false;
  if (v.toLowerCase() === 'null') return null;
  if (!isNaN(Number(v))) return Number(v);
  return v;
}

function evaluateWhere(row: Record<string, any>, whereClause?: string): boolean {
  if (!whereClause) return true;
  const parts = whereClause.split('=').map(s => s.trim());
  if (parts.length === 2) {
    const key = parts[0];
    const val = parseValue(parts[1]);
    return row[key] == val; // intentionally loose equality
  }
  return false;
}

function parseSet(setClause: string): Record<string, any> {
  const updates: Record<string, any> = {};
  const pairs = setClause.split(',');
  for (const pair of pairs) {
    const [k, v] = pair.split('=').map(s => s.trim());
    if (k && v !== undefined) {
      updates[k] = parseValue(v);
    }
  }
  return updates;
}

function generateColumns(data: Record<string, any>[]): SqlColumn[] {
  if (data.length === 0) return [];
  return Object.keys(data[0]).map(key => ({
    name: key,
    type: typeof data[0][key] === "number" ? "number" : typeof data[0][key] === "boolean" ? "boolean" : "string"
  }));
}

export const mockSqlEngine = {
  reset() {
    dbState = JSON.parse(JSON.stringify(SAMPLE_DATABASE));
  },
  execute: async (query: SqlQuery): Promise<SqlResult> => {
    const startTime = performance.now();
    const text = query.text.trim();
    
    // simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const finalize = (rows: any[], message?: string, error?: string): SqlResult => {
      const endTime = performance.now();
      const executionTimeMs = Math.round(endTime - startTime);
      return {
        columns: generateColumns(rows),
        rows,
        executionTimeMs,
        rowCount: rows.length,
        message,
        error
      };
    };

    if (!text) {
      return finalize([], undefined, "Empty query.");
    }

    // Since users may use multiple queries separated by semicolons or just one,
    // let's just parse the first command for simplicity in this mock engine.
    const cleanText = text.replace(/;+$/, "").trim();

    try {
      // 1. SELECT
      const selectMatch = cleanText.match(/^SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?$/i);
      if (selectMatch) {
        const [_, colsStr, table, where] = selectMatch;
        if (!dbState[table]) return finalize([], undefined, `Table '${table}' does not exist.`);
        let rows = dbState[table].filter(row => evaluateWhere(row, where));
        
        if (colsStr.trim() !== '*') {
          const selectedCols = colsStr.split(',').map(s => s.trim());
          rows = rows.map(row => {
            const newRow: Record<string, any> = {};
            selectedCols.forEach(col => {
              if (col in row) newRow[col] = row[col];
            });
            return newRow;
          });
        }
        
        return finalize(rows);
      }

      // 2. UPDATE
      const updateMatch = cleanText.match(/^UPDATE\s+(\w+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+?))?$/i);
      if (updateMatch) {
        const [_, table, setStr, where] = updateMatch;
        if (!dbState[table]) return finalize([], undefined, `Table '${table}' does not exist.`);
        
        const updates = parseSet(setStr);
        let updatedCount = 0;
        
        dbState[table] = dbState[table].map(row => {
          if (evaluateWhere(row, where)) {
            updatedCount++;
            return { ...row, ...updates };
          }
          return row;
        });

        return finalize(dbState[table], `${updatedCount} row(s) updated successfully.`);
      }

      // 3. INSERT
      const insertMatch = cleanText.match(/^INSERT\s+INTO\s+(\w+)\s*\((.+?)\)\s*VALUES\s*\((.+?)\)$/i);
      if (insertMatch) {
        const [_, table, colsStr, valsStr] = insertMatch;
        if (!dbState[table]) return finalize([], undefined, `Table '${table}' does not exist.`);
        
        const cols = colsStr.split(',').map(s => s.trim());
        const vals = valsStr.split(',').map(s => parseValue(s));
        
        if (cols.length !== vals.length) {
          return finalize([], undefined, "Column count doesn't match value count.");
        }

        const newRow: Record<string, any> = {};
        cols.forEach((col, i) => {
          newRow[col] = vals[i];
        });
        
        dbState[table].push(newRow);
        
        return finalize(dbState[table], `1 row(s) inserted successfully.`);
      }

      // 4. DELETE
      const deleteMatch = cleanText.match(/^DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?$/i);
      if (deleteMatch) {
        const [_, table, where] = deleteMatch;
        if (!dbState[table]) return finalize([], undefined, `Table '${table}' does not exist.`);
        
        const initialCount = dbState[table].length;
        dbState[table] = dbState[table].filter(row => !evaluateWhere(row, where));
        const deletedCount = initialCount - dbState[table].length;
        
        return finalize(dbState[table], `${deletedCount} row(s) deleted successfully.`);
      }

      return finalize([], undefined, "Syntax error or unsupported mock query. Supported: SELECT, INSERT, UPDATE, DELETE.");
    } catch (err: any) {
      return finalize([], undefined, `Error executing query: ${err.message}`);
    }
  }
};
