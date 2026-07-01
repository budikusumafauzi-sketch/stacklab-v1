import { EditorConfig } from "../../types/editor";
import { PLATFORM_CONFIG } from "../../config/platform";

export const createEditorConfig = (overrides: Partial<EditorConfig>): EditorConfig => {
  return {
    language: overrides.language || PLATFORM_CONFIG.supportedLanguages[0],
    theme: overrides.theme || PLATFORM_CONFIG.defaultTheme,
    readOnly: overrides.readOnly ?? false,
    tabSize: overrides.tabSize || PLATFORM_CONFIG.defaultTabSize,
    minimap: overrides.minimap ?? false,
    wordWrap: overrides.wordWrap || "on",
    lineNumbers: overrides.lineNumbers || "on"
  };
};
