export type ErrorSeverity = 'info' | 'warning' | 'error' | 'fatal';

export interface EditorError {
  message: string;
  line?: number;
  column?: number;
  severity: ErrorSeverity;
}

export class LabError extends Error {
  public details: EditorError;

  constructor(details: EditorError) {
    super(details.message);
    this.name = 'LabError';
    this.details = details;
  }
}
