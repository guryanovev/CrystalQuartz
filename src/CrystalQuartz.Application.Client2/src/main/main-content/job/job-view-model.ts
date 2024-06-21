import { Job, Trigger } from '../../../api';
import { PauseJobCommand, ResumeJobCommand, DeleteJobCommand, ExecuteNowCommand } from '../../../commands/job-commands';
import { CommandService } from '../../../services';
import { ApplicationModel } from '../../../application-model';
import { ManagableActivityViewModel } from '../activity-view-model';
import ActivitiesSynschronizer from '../activities-synschronizer';
import { TriggerViewModel } from '../trigger/trigger-view-model';
import Timeline from '../../../timeline/timeline';

import { IDialogManager } from '../../../dialogs/dialog-manager';
import JobDetailsViewModel from '../../../dialogs/job-details/job-details-view-model';

import { ISchedulerStateService } from '../../../scheduler-state-service';

import CommandAction from '../../../command-action';
import Action from '../../../global/actions/action';
import {SHOW_SCHEDULE_JOB_DIALOG} from '../../../dialogs/show-schedule-job-dialog';
import { ObservableList } from 'john-smith/reactive';

export class JobViewModel extends ManagableActivityViewModel<Job> {
    triggers = new ObservableList<TriggerViewModel>();

    executeNowAction = new CommandAction(this.applicationModel, this.commandService, 'Execute Now', () => new ExecuteNowCommand(this.group, this.name));
    addTriggerAction = new Action('Add Trigger', () => this.addTrigger());

    private triggersSynchronizer: ActivitiesSynschronizer<Trigger, TriggerViewModel> = new ActivitiesSynschronizer<Trigger, TriggerViewModel>(
        (trigger: Trigger, triggerViewModel: TriggerViewModel) => trigger.Name === triggerViewModel.name,
        (trigger: Trigger) => new TriggerViewModel(trigger, this.commandService, this.applicationModel, this.timeline, this.dialogManager, this.schedulerStateService),
        this.triggers);

    constructor(
        private job: Job,
        private group: string,
        commandService: CommandService,
        applicationModel: ApplicationModel,
        private timeline: Timeline,
        private dialogManager: IDialogManager,
        private schedulerStateService: ISchedulerStateService) {

        super(job, commandService, applicationModel);
    }

    loadJobDetails() {
        this.dialogManager.showModal(new JobDetailsViewModel(this.job, this.commandService), result => {});
    }

    updateFrom(job: Job) {
        super.updateFrom(job);

        this.triggersSynchronizer.sync(job.Triggers);
    }

    getDeleteConfirmationsText(): string {
        return 'Are you sure you want to delete job?';
    }

    getPauseAction() {
        return {
            title: 'Pause all triggers',
            command: () => new PauseJobCommand(this.group, this.name)
        };
    }

    getResumeAction() {
        return {
            title: 'Resume all triggers',
            command: () => new ResumeJobCommand(this.group, this.name)
        };
    }

    getDeleteAction() {
        return {
            title: 'Delete job',
            command: () => new DeleteJobCommand(this.group, this.name)
        };
    }

    private addTrigger() {
        SHOW_SCHEDULE_JOB_DIALOG(
            this.dialogManager,
            this.applicationModel,
            this.commandService,
            {
                predefinedGroup: this.job.GroupName,
                predefinedJob: this.job.Name
            });
    }
}
