import { ElementType } from "react";

export interface ICommandContext {
  [key: string]: unknown;
}

export interface ICommand {
  id: string;
  name: string;
  description?: string;
  icon?: ElementType;
  execute: (context?: ICommandContext) => void | Promise<void>;
  canExecute?: (context?: ICommandContext) => boolean;
}

