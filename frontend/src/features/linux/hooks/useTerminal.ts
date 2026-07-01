import { useState, useRef, useEffect } from "react";
import { ProcessState, TerminalOutput } from "../types/terminal";
import { terminalEngine } from "../services/engine";

export function useTerminal() {
  const [history, setHistory] = useState<TerminalOutput[]>([]);
  const [state, setState] = useState<ProcessState>({
    cwd: "/home/user",
    env: {},
    user: "guest",
    aliases: {},
    commandHistory: [],
    editingFile: null,
    editingContent: ""
  });
  
  const endRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);
  
  const executeCommand = (command: string) => {
    const id = Date.now().toString();
    
    // Add input to history
    setHistory(prev => [...prev, {
      id: id + "-in",
      type: "input",
      content: command,
      cwd: state.cwd
    }]);
    
    // Execute
    const result = terminalEngine.execute(command, state);
    
    if (result.output === "__CLEAR__") {
      setHistory([]);
      return;
    }
    
    if (result.output) {
      setHistory(prev => [...prev, {
        id: id + "-out",
        type: result.error ? "error" : "output",
        content: result.output,
        cwd: state.cwd
      }]);
    }
    
    if (result.newState) {
      setState(prev => ({ ...prev, ...result.newState }));
    }
    
    // Add command to ProcessState history
    if (command.trim()) {
      setState(prev => ({
        ...prev,
        commandHistory: [...(prev.commandHistory || []), command]
      }));
    }
  };
  
  const clearTerminal = () => setHistory([]);
  
  return {
    history,
    state,
    setState,
    executeCommand,
    clearTerminal,
    endRef
  };
}
