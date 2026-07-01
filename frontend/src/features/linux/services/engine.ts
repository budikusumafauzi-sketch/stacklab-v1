import { ProcessState } from "../types/terminal";
import { parseCommand } from "../parser/parser";
import { builtins } from "../commands";

export class TerminalEngineService {
  execute(input: string, state: ProcessState): { output: string; error?: boolean; newState?: Partial<ProcessState> } {
    if (!input.trim()) return { output: "" };
    
    const { command, args } = parseCommand(input, state);
    const handler = builtins[command];
    
    if (handler) {
      try {
        return handler(args, state);
      } catch {
        return { output: `Error executing command: ${command}`, error: true };
      }
    }
    
    return { output: `bash: ${command}: command not found`, error: true };
  }
}

export const terminalEngine = new TerminalEngineService();
