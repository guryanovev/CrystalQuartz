import { ObservableValue } from 'john-smith/reactive';
import { ICommand } from '../commands/contracts';
import { CommandService } from '../services';

export default class CommandProgressViewModel {
  private _commands: ICommand<unknown>[] = [];

  public readonly active = new ObservableValue<boolean>(false);
  public readonly commandsCount = new ObservableValue<number>(0);
  public readonly currentCommand = new ObservableValue<string | null>(null);

  public constructor(commandService: CommandService) {
    commandService.onCommandStart.listen((command) => this.addCommand(command));
    commandService.onCommandComplete.listen((command) => this.removeCommand(command));
  }

  private addCommand(command: ICommand<unknown>) {
    this._commands.push(command);
    this.updateState();
  }

  private removeCommand(command: ICommand<unknown>) {
    this._commands = this._commands.filter((c) => c !== command);
    this.updateState();
  }

  private updateState() {
    this.active.setValue(this._commands.length > 0);
    this.commandsCount.setValue(this._commands.length);
    if (this._commands.length > 0) {
      this.currentCommand.setValue(this._commands[this._commands.length - 1].message);
    }
  }
}
