import { ICommand } from '../commands/contracts';
import { CommandService } from '../services';

import __last from 'lodash/last';
import __filter from 'lodash/filter';

export default class CommandProgressViewModel {
    private _commands: ICommand<any>[] = [];

    active = js.observableValue<boolean>();
    commandsCount = js.observableValue<number>();
    currentCommand = js.observableValue<string>();

    constructor(private commandService: CommandService) {
        commandService.onCommandStart.listen(command => this.addCommand(command));
        commandService.onCommandComplete.listen(command => this.removeCommand(command));
    }

    private addCommand(command: ICommand<any>) {
        this._commands.push(command);
        this.updateState();
    }

    private removeCommand(command: ICommand<any>) {
        this._commands = __filter(this._commands, c => c !== command);
        this.updateState();
    }

    private updateState() {
        this.active.setValue(this._commands.length > 0);
        this.commandsCount.setValue(this._commands.length);
        if (this._commands.length > 0) {
            this.currentCommand.setValue(__last(this._commands).message);
        }
    }
}