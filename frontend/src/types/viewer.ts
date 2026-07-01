export type ViewerMode = "tree" | "raw" | "table" | "data";

export interface ViewerConfig {
  mode: ViewerMode;
  readOnly?: boolean;
}
