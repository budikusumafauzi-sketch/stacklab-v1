import { CodeEditor } from "../editor/CodeEditor";
import { EditorLanguage } from "../../types/editor";

interface RawViewerProps {
  content: string;
  language?: EditorLanguage;
}

export function RawViewer({ content, language = "plaintext" }: RawViewerProps) {
  return (
    <CodeEditor
      config={{ language, readOnly: true, lineNumbers: "off", minimap: false }}
      value={content}
    />
  );
}
