import { ProcessState } from "../types/terminal";

export function parseCommand(input: string, state: ProcessState): { command: string; args: string[] } {
  // Expand variables
  let processedInput = input;
  Object.keys(state.env).forEach(key => {
    processedInput = processedInput.replace(new RegExp(`\\$${key}\\b`, "g"), state.env[key]);
  });
  
  // Also handle $USER, $PWD explicitly if missing in env
  processedInput = processedInput.replace(/\$USER\b/g, state.user);
  processedInput = processedInput.replace(/\$PWD\b/g, state.cwd);

  const parts = processedInput.trim().split(/\s+/);
  let command = parts[0] || "";
  
  // Expand alias if it exists
  if (state.aliases && state.aliases[command]) {
     const aliasParts = state.aliases[command].split(/\s+/);
     command = aliasParts[0];
     parts.splice(0, 1, ...aliasParts);
  }
  
  return {
    command: parts[0] || "",
    args: parts.slice(1)
  };
}
