import { SchedulerData } from './api';
import { ApplicationModel } from './application-model';
import { ICommand } from './commands/contracts';
import Action from './global/actions/action';
import { CommandService } from './services';

export default class CommandAction extends Action {
  constructor(
    application: ApplicationModel,
    commandService: CommandService,
    title: string,
    commandFactory: () => ICommand<SchedulerData>,
    confirmText?: string
  ) {
    super(
      title,
      () =>
        commandService.executeCommand(commandFactory()).then((data) => application.setData(data)),
      confirmText
    );
  }
}
