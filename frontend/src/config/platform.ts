import { EditorLanguage, EditorTheme } from "../types/editor";

export const PLATFORM_CONFIG = {
  supportedLanguages: ["json", "sql", "javascript", "plaintext"] as EditorLanguage[],
  defaultTheme: "vs-dark" as EditorTheme,
  defaultTabSize: 2,
};
