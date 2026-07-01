import { EditorError } from "../../../lib/errors";

export function formatJson(json: string): string {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed, null, 2);
  } catch {
    throw new Error("Invalid JSON");
  }
}

export function minifyJson(json: string): string {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed);
  } catch {
    throw new Error("Invalid JSON");
  }
}

export function validateJson(json: string): { valid: boolean; error?: EditorError } {
  if (!json.trim()) {
    return { valid: true };
  }
  try {
    JSON.parse(json);
    return { valid: true };
  } catch (err: unknown) {
    const e = err as Error;
    const match = /at position (\d+)/.exec(e.message);
    let line = undefined;
    let column = undefined;
    
    if (match) {
        const position = parseInt(match[1], 10);
        const upToPosition = json.substring(0, position);
        const lines = upToPosition.split('\n');
        line = lines.length;
        column = lines[lines.length - 1].length + 1;
    }

    return {
      valid: false,
      error: {
        message: e.message || "Invalid JSON",
        severity: "error",
        line,
        column
      }
    };
  }
}
