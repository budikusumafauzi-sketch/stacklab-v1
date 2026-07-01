import { EditorError } from "../../lib/errors";
import { validateJson } from "../../features/json/utils/json";

export interface ValidationResult {
  valid: boolean;
  error?: EditorError;
}

export const validationProvider = {
  json: (content: string): ValidationResult => {
    return validateJson(content);
  },
  sql: (content: string): ValidationResult => {
    if (!content.trim()) return { valid: true };
    return { valid: true };
  }
};
