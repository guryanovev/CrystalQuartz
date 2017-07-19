import Action from './global/actions/action';
import { CommandService } from './services';
import { ApplicationModel } from './application-model';
import { ICommand } from './commands/contracts';
import { SchedulerData } from './api';

export default class CommandAction extends Action {
    constructor(application: ApplicationModel, commandService: CommandService, title: string, command: ICommand<SchedulerData>, confirmText?: string) {
        super(
            title,
            () => commandService.executeCommand(command).done(data => application.setData(data)),
            confirmText);
    }
}