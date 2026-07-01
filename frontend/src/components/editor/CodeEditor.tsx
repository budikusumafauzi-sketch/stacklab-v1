import { Editor, EditorProps } from "@monaco-editor/react";
import { cn } from "../../lib/utils";
import { EditorConfig } from "../../types/editor";
import { createEditorConfig } from "./editor-config";
import { useSettings } from "../../hooks/useSettings";

export interface CodeEditorProps extends Omit<EditorProps, 'theme' | 'language' | 'options'> {
  className?: string;
  config: Partial<EditorConfig>;
  options?: EditorProps["options"];
}

export function CodeEditor({
  className,
  config,
  options,
  ...props
}: CodeEditorProps) {
  const { state } = useSettings();
  const finalConfig = createEditorConfig(config);

  // Settings from context take precedence for consistent UX across labs
  const effectiveMinimap = state.editor.minimap;
  const effectiveWordWrap = state.editor.wordWrap;

  // Determine actual theme string for Monaco ("vs-dark" or "light")
  const resolveEditorTheme = () => {
    let mode = state.theme.mode;
    if (mode === "system") {
      mode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return mode === "dark" ? "vs-dark" : "light";
  };
  const effectiveTheme = resolveEditorTheme();

  return (
    <div className={cn("w-full h-full relative overflow-hidden", className)}>
      <Editor
        language={finalConfig.language}
        theme={effectiveTheme}
        options={{
          minimap: { enabled: effectiveMinimap },
          fontSize: state.editor.fontSize,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          wordWrap: effectiveWordWrap,
          readOnly: finalConfig.readOnly,
          lineNumbers: finalConfig.lineNumbers,
          tabSize: state.editor.tabSize,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          ...options,
        }}
        {...props}
      />
    </div>
  );
}
