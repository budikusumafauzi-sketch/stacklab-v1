export type EditorLanguage = "json" | "sql" | "javascript" | "plaintext";
export type EditorTheme = "vs-dark" | "light";

export interface EditorConfig {
  language: EditorLanguage;
  theme?: EditorTheme;
  readOnly?: boolean;
  tabSize?: number;
  minimap?: boolean;
  wordWrap?: "on" | "off";
  lineNumbers?: "on" | "off";
}
