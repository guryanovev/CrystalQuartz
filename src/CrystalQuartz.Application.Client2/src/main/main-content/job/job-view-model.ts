import { ObservableList } from 'john-smith/reactive';
import { Job, Trigger } from '../../../api';
import { ApplicationModel } from '../../../application-model';
import CommandAction from '../../../command-action';
import {
  DeleteJobCommand,
  ExecuteNowCommand,
  PauseJobCommand,
  ResumeJobCommand,
} from '../../../commands/job-commands';
import { IDialogManager } from '../../../dialogs/dialog-manager';
import JobDetailsViewModel from '../../../dialogs/job-details/job-details-view-model';
import { SHOW_SCHEDULE_JOB_DIALOG } from '../../../dialogs/show-schedule-job-dialog';
import Action from '../../../global/actions/action';
import { ISchedulerStateService } from '../../../scheduler-state-service';
import { CommandService } from '../../../services';
import Timeline from '../../../timeline/timeline';
import ActivitiesSynschronizer from '../activities-synschronizer';
import { ManagableActivityViewModel } from '../activity-view-model';
import { TriggerViewModel } from '../trigger/trigger-view-model';

export class JobViewModel extends ManagableActivityViewModel<Job> {
  public readonly triggers = new ObservableList<TriggerViewModel>();

  public readonly executeNowAction = new CommandAction(
    this.applicationModel,
    this.commandService,
    'Execute Now',
    () => new ExecuteNowCommand(this.group, this.name)
  );
  public readonly addTriggerAction = new Action('Add Trigger', () => this.addTrigger());

  private triggersSynchronizer: ActivitiesSynschronizer<Trigger, TriggerViewModel> =
    new ActivitiesSynschronizer<Trigger, TriggerViewModel>(
      (trigger: Trigger, triggerViewModel: TriggerViewModel) =>
        trigger.Name === triggerViewModel.name,
      (trigger: Trigger) =>
        new TriggerViewModel(
          trigger,
          this.commandService,
          this.applicationModel,
          this.timeline,
          this.dialogManager,
          this.schedulerStateService
        ),
      this.triggers
    );

  public constructor(
    private job: Job,
    private group: string,
    commandService: CommandService,
    applicationModel: ApplicationModel,
    private timeline: Timeline,
    private dialogManager: IDialogManager,
    private schedulerStateService: ISchedulerStateService
  ) {
    super(job, commandService, applicationModel);
  }

  public loadJobDetails() {
    this.dialogManager.showModal(new JobDetailsViewModel(this.job, this.commandService), (_) => {});
  }

  public updateFrom(job: Job) {
    super.updateFrom(job);

    this.triggersSynchronizer.sync(job.Triggers);
  }

  public getDeleteConfirmationsText(): string {
    return 'Are you sure you want to delete job?';
  }

  public getPauseAction() {
    return {
      title: 'Pause all triggers',
      command: () => new PauseJobCommand(this.group, this.name),
    };
  }

  public getResumeAction() {
    return {
      title: 'Resume all triggers',
      command: () => new ResumeJobCommand(this.group, this.name),
    };
  }

  public getDeleteAction() {
    return {
      title: 'Delete job',
      command: () => new DeleteJobCommand(this.group, this.name),
    };
  }

  private addTrigger() {
    SHOW_SCHEDULE_JOB_DIALOG(this.dialogManager, this.applicationModel, this.commandService, {
      predefinedGroup: this.job.GroupName,
      predefinedJob: this.job.Name,
    });
  }
}
