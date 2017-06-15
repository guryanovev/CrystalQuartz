import { JobGroup, Job, SchedulerData } from '../../api';
import { CommandService } from '../../services';
import { ICommand } from '../../commands/contracts';
import { PauseGroupCommand, ResumeGroupCommand, DeleteGroupCommand } from '../../commands/job-group-commands';
import { ApplicationModel } from '../../application-model';
import { ManagableActivityViewModel } from '../activity-view-model';
import ActivitiesSynschronizer from '../activities-synschronizer';
import { JobViewModel } from '../job/job-view-model';
import Timeline from '../../timeline/timeline';
import { IDialogManager } from '../../dialogs/dialog-manager';

export class JobGroupViewModel extends ManagableActivityViewModel<JobGroup> {
    jobs = js.observableList<JobViewModel>();

    private jobsSynchronizer: ActivitiesSynschronizer<Job, JobViewModel> = new ActivitiesSynschronizer<Job, JobViewModel>(
        (job: Job, jobViewModel: JobViewModel) => job.Name === jobViewModel.name,
        (job: Job) => new JobViewModel(job, this.name, this.commandService, this.applicationModel, this.timeline, this.dialogManager),
        this.jobs);

    constructor(
        group: JobGroup,
        commandService: CommandService,
        applicationModel: ApplicationModel,
        private timeline: Timeline,
        private dialogManager: IDialogManager) {

        super(group, commandService, applicationModel);
    }

    updateFrom(group: JobGroup) {
        super.updateFrom(group);

        this.jobsSynchronizer.sync(group.Jobs);
    }

    getDeleteConfirmationsText(): string {
        return 'Are you sure you want to delete all jobs?';
    }

    createResumeCommand(): ICommand<SchedulerData> {
        return new ResumeGroupCommand(this.name);
    }

    createPauseCommand(): ICommand<SchedulerData> {
        return new PauseGroupCommand(this.name);
    }

    createDeleteCommand(): ICommand<SchedulerData> {
        return new DeleteGroupCommand(this.name);
    }
}