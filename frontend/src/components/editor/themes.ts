import { EditorTheme } from "../../types/editor";
import { editor } from "monaco-editor";

export const THEMES: Record<EditorTheme, editor.IStandaloneThemeData> = {
  "vs-dark": {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {}
  },
  "light": {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {}
  }
};
