import React, { useState } from "react";
import { useTerminal } from "../hooks/useTerminal";

export function TerminalScreen() {
  const { history, state, setState, executeCommand, endRef } = useTerminal();
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
      setHistoryIndex(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (state.commandHistory && state.commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? state.commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(state.commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (state.commandHistory && historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= state.commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(state.commandHistory[newIndex]);
        }
      }
    }
  };
  
  if (state.editingFile) {
    return (
      <div className="flex flex-col h-full bg-zinc-950 text-zinc-200 font-mono text-sm p-4 rounded-md shadow-inner">
        <div className="flex justify-between bg-zinc-900 px-2 py-1 mb-2 rounded font-bold">
          <span>GNU nano 6.2</span>
          <span>{state.editingFile}</span>
          <span></span>
        </div>
        <textarea
          className="flex-1 bg-transparent outline-none resize-none"
          value={state.editingContent}
          onChange={(e) => setState(prev => ({ ...prev, editingContent: e.target.value }))}
          autoFocus
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === "o") {
              e.preventDefault();
              executeCommand(`__internal_save ${state.editingFile} ${btoa(state.editingContent || "")}`);
            }
            if (e.ctrlKey && e.key === "x") {
              e.preventDefault();
              setState(prev => ({ ...prev, editingFile: null, editingContent: "" }));
            }
          }}
        />
        <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-zinc-400">
          <div><span className="font-bold text-white">^O</span> Save</div>
          <div><span className="font-bold text-white">^X</span> Exit</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col h-full bg-zinc-950 text-green-500 font-mono text-sm p-4 overflow-y-auto rounded-md shadow-inner"
      onClick={() => document.getElementById("terminal-input")?.focus()}
    >
      <div className="flex-1 space-y-1">
        {history.map((entry) => (
          <div key={entry.id}>
            {entry.type === "input" && (
              <div className="flex items-center flex-wrap">
                <span className="text-blue-400 mr-2">{state.user}@stacklab</span>
                <span className="text-zinc-500 mr-2">{entry.cwd}</span>
                <span className="text-zinc-400 mr-2">$</span>
                <span className="text-zinc-200 whitespace-pre-wrap">{entry.content}</span>
              </div>
            )}
            {(entry.type === "output" || entry.type === "error") && (
              <div 
                className={entry.type === "error" ? "text-red-400" : "text-zinc-300"}
                dangerouslySetInnerHTML={{ __html: entry.content }}
              />
            )}
          </div>
        ))}
        
        <div className="flex items-center pt-2 flex-wrap">
          <span className="text-blue-400 mr-2">{state.user}@stacklab</span>
          <span className="text-zinc-500 mr-2">{state.cwd}</span>
          <span className="text-zinc-400 mr-2">$</span>
          <input 
            id="terminal-input"
            type="text"
            className="flex-1 bg-transparent outline-none text-zinc-200 min-w-[200px]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
}
