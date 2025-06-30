import { ObservableValue } from 'john-smith/reactive';
import { Activity, ActivityStatus, SchedulerData } from '../../api';
import { ApplicationModel } from '../../application-model';
import CommandAction from '../../command-action';
import { ICommand } from '../../commands/contracts';
import Action from '../../global/actions/action';
import { CommandService } from '../../services';

export interface IActionInfo {
  title: string;
  command: () => ICommand<SchedulerData>;
}

export abstract class ManagableActivityViewModel<TActivity extends Activity> {
  public readonly name: string;
  public readonly status = new ObservableValue<ActivityStatus>(ActivityStatus.Active /* todo */);

  public readonly resumeAction: Action;
  public readonly pauseAction: Action;
  public readonly deleteAction: Action;

  protected constructor(
    activity: Activity,
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

  public updateFrom(activity: TActivity) {
    this.status.setValue(activity.Status);

    this.resumeAction.enabled =
      activity.Status === ActivityStatus.Paused || activity.Status === ActivityStatus.Mixed;
    this.pauseAction.enabled =
      activity.Status === ActivityStatus.Active || activity.Status === ActivityStatus.Mixed;
    this.deleteAction.enabled = true;
  }

  public abstract getDeleteConfirmationsText(): string;
  public abstract getResumeAction(): IActionInfo;
  public abstract getPauseAction(): IActionInfo;
  public abstract getDeleteAction(): IActionInfo;
}
