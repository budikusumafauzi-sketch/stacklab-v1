export interface ProcessState {
  cwd: string;
  env: Record<string, string>;
  user: string;
  aliases?: Record<string, string>;
  commandHistory?: string[];
  editingFile?: string | null;
  editingContent?: string;
}

export interface TerminalOutput {
  id: string;
  type: "input" | "output" | "error" | "system";
  content: string;
  cwd?: string;
}
