import { ICommand } from '../commands/contracts';
import { CommandService } from '../services';
import { ObservableValue } from 'john-smith/reactive';

export default class CommandProgressViewModel {
    private _commands: ICommand<any>[] = [];

    active = new ObservableValue<boolean>(false);
    commandsCount = new ObservableValue<number>(0);
    currentCommand = new ObservableValue<string | null>(null);

    constructor(private commandService: CommandService) {
        commandService.onCommandStart.listen(command => this.addCommand(command));
        commandService.onCommandComplete.listen(command => this.removeCommand(command));
    }

    private addCommand(command: ICommand<any>) {
        this._commands.push(command);
        this.updateState();
    }

    private removeCommand(command: ICommand<any>) {
        this._commands = this._commands.filter(c => c !== command);
        this.updateState();
    }

    private updateState() {
        this.active.setValue(this._commands.length > 0);
        this.commandsCount.setValue(this._commands.length);
        if (this._commands.length > 0) {
            this.currentCommand.setValue((this._commands[this._commands.length - 1]).message);
        }
    }
}
