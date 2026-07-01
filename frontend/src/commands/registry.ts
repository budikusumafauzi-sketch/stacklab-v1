import { ICommand, ICommandContext } from "../types/command";

class CommandRegistry {
  private commands = new Map<string, ICommand>();

  register(command: ICommand) {
    this.commands.set(command.id, command);
  }

  get(id: string): ICommand | undefined {
    return this.commands.get(id);
  }

  execute(id: string, context?: ICommandContext) {
    const cmd = this.commands.get(id);
    if (cmd && (!cmd.canExecute || cmd.canExecute(context))) {
      return cmd.execute(context);
    }
    console.warn(`Command ${id} not found or cannot execute`);
  }

  getAll(): ICommand[] {
    return Array.from(this.commands.values());
  }
}

export const commandRegistry = new CommandRegistry();
