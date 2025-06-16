import { ObservableValue } from 'john-smith/reactive';
import { ActivityStatus, ManagableActivity, SchedulerData } from '../../api';
import { ApplicationModel } from '../../application-model';
import CommandAction from '../../command-action';
import { ICommand } from '../../commands/contracts';
import Action from '../../global/actions/action';
import { CommandService } from '../../services';

export interface IActionInfo {
  title: string;
  command: () => ICommand<SchedulerData>;
}

export abstract class ManagableActivityViewModel<TActivity extends ManagableActivity> {
  name: string;
  status = new ObservableValue<ActivityStatus>(ActivityStatus.Active /* todo */);

  resumeAction: Action;
  pauseAction: Action;
  deleteAction: Action;

  constructor(
    activity: ManagableActivity,
    public commandService: CommandService,
    public applicationModel: ApplicationModel
  ) {
    this.name = activity.Name;

    const resumeActionInfo = this.getResumeAction();
    const pauseActionInfo = this.getPauseAction();
    const deleteActionInfo = this.getDeleteAction();

    this.resumeAction = new CommandAction(
      this.applicationModel,
      this.commandService,
      resumeActionInfo.title,
      resumeActionInfo.command
    );
    this.pauseAction = new CommandAction(
      this.applicationModel,
      this.commandService,
      pauseActionInfo.title,
      pauseActionInfo.command
    );
    this.deleteAction = new CommandAction(
      this.applicationModel,
      this.commandService,
      deleteActionInfo.title,
      deleteActionInfo.command,
      this.getDeleteConfirmationsText()
    );
  }

  updateFrom(activity: TActivity) {
    this.status.setValue(activity.Status);

    this.resumeAction.enabled =
      activity.Status === ActivityStatus.Paused || activity.Status === ActivityStatus.Mixed;
    this.pauseAction.enabled =
      activity.Status === ActivityStatus.Active || activity.Status === ActivityStatus.Mixed;
    this.deleteAction.enabled = true;
  }

  abstract getDeleteConfirmationsText(): string;
  abstract getResumeAction(): IActionInfo;
  abstract getPauseAction(): IActionInfo;
  abstract getDeleteAction(): IActionInfo;
}
