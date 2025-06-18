import { ObservableList } from 'john-smith/reactive';
import { Job, JobGroup } from '../../../api';
import { ApplicationModel } from '../../../application-model';
import {
  DeleteGroupCommand,
  PauseGroupCommand,
  ResumeGroupCommand,
} from '../../../commands/job-group-commands';
import { IDialogManager } from '../../../dialogs/dialog-manager';
import { SHOW_SCHEDULE_JOB_DIALOG } from '../../../dialogs/show-schedule-job-dialog';
import Action from '../../../global/actions/action';
import { ISchedulerStateService } from '../../../scheduler-state-service';
import { CommandService } from '../../../services';
import Timeline from '../../../timeline/timeline';
import ActivitiesSynschronizer from '../activities-synschronizer';
import { ManagableActivityViewModel } from '../activity-view-model';
import { JobViewModel } from '../job/job-view-model';

export class JobGroupViewModel extends ManagableActivityViewModel<JobGroup> {
  public readonly jobs = new ObservableList<JobViewModel>();

  public readonly scheduleJobAction = new Action('Schedule Job', () => {
    SHOW_SCHEDULE_JOB_DIALOG(this.dialogManager, this.applicationModel, this.commandService, {
      predefinedGroup: this.group.Name,
    });
  });

  private jobsSynchronizer: ActivitiesSynschronizer<Job, JobViewModel> =
    new ActivitiesSynschronizer<Job, JobViewModel>(
      (job: Job, jobViewModel: JobViewModel) => job.Name === jobViewModel.name,
      (job: Job) =>
        new JobViewModel(
          job,
          this.name,
          this.commandService,
          this.applicationModel,
          this.timeline,
          this.dialogManager,
          this.schedulerStateService
        ),
      this.jobs
    );

  public constructor(
    public group: JobGroup,
    commandService: CommandService,
    applicationModel: ApplicationModel,
    private timeline: Timeline,
    private dialogManager: IDialogManager,
    private schedulerStateService: ISchedulerStateService
  ) {
    super(group, commandService, applicationModel);
  }

  public updateFrom(group: JobGroup) {
    super.updateFrom(group);

    this.jobsSynchronizer.sync(group.Jobs);
  }

  public getDeleteConfirmationsText(): string {
    return 'Are you sure you want to delete all jobs?';
  }

  public getPauseAction() {
    return {
      title: 'Pause all jobs',
      command: () => new PauseGroupCommand(this.name),
    };
  }

  public getResumeAction() {
    return {
      title: 'Resume all jobs',
      command: () => new ResumeGroupCommand(this.name),
    };
  }

  public getDeleteAction() {
    return {
      title: 'Delete all jobs',
      command: () => new DeleteGroupCommand(this.name),
    };
  }
}
