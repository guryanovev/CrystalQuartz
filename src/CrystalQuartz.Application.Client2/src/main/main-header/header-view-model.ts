import { ObservableValue } from 'john-smith/reactive';
import { SchedulerData } from '../../api';
import { ApplicationModel } from '../../application-model';
import CommandAction from '../../command-action';
import CommandProgressViewModel from '../../command-progress/command-progress-view-model';
import {
  PauseSchedulerCommand,
  ResumeSchedulerCommand,
  StandbySchedulerCommand,
  StartSchedulerCommand,
  StopSchedulerCommand,
} from '../../commands/scheduler-commands';
import { IDialogManager } from '../../dialogs/dialog-manager';
import SchedulerDetails from '../../dialogs/scheduler-details/scheduler-details-view-model';
import { SHOW_SCHEDULE_JOB_DIALOG } from '../../dialogs/show-schedule-job-dialog';
import Action from '../../global/actions/action';
import { CommandService } from '../../services';
import Timeline from '../../timeline/timeline';

export default class MainHeaderViewModel {
  public readonly name = new ObservableValue<string | null>(null);
  public readonly instanceId = new ObservableValue<string | null>(null);

  public readonly status = new ObservableValue<string | null>(null);

  public readonly startAction = new CommandAction(
    this.application,
    this.commandService,
    'Start',
    () => new StartSchedulerCommand()
  );
  public readonly pauseAllAction = new CommandAction(
    this.application,
    this.commandService,
    'Pause All',
    () => new PauseSchedulerCommand()
  );
  public readonly resumeAllAction = new CommandAction(
    this.application,
    this.commandService,
    'Resume All',
    () => new ResumeSchedulerCommand()
  );
  public readonly standbyAction = new CommandAction(
    this.application,
    this.commandService,
    'Standby',
    () => new StandbySchedulerCommand()
  );
  public readonly shutdownAction = new CommandAction(
    this.application,
    this.commandService,
    'Shutdown',
    () => new StopSchedulerCommand(),
    'Are you sure you want to shutdown scheduler?'
  );

  public readonly scheduleJobAction = new Action('+', () => {
    this.scheduleJob();
  });

  public readonly commandProgress = new CommandProgressViewModel(this.commandService);

  public constructor(
    public timeline: Timeline,
    private commandService: CommandService,
    private application: ApplicationModel,
    private dialogManager: IDialogManager
  ) {}

  public updateFrom(data: SchedulerData) {
    this.name.setValue(data.Name);
    this.instanceId.setValue(data.InstanceId);
    this.status.setValue(data.Status);

    this.startAction.enabled = data.Status === 'ready';
    this.shutdownAction.enabled = data.Status !== 'shutdown';
    this.standbyAction.enabled = data.Status === 'started';
    this.pauseAllAction.enabled = data.Status === 'started';
    this.resumeAllAction.enabled = data.Status === 'started';
    this.scheduleJobAction.enabled = data.Status !== 'shutdown';
  }

  public showSchedulerDetails() {
    this.dialogManager.showModal(new SchedulerDetails(this.commandService), (_) => {});
  }

  private scheduleJob() {
    SHOW_SCHEDULE_JOB_DIALOG(this.dialogManager, this.application, this.commandService);
  }
}
