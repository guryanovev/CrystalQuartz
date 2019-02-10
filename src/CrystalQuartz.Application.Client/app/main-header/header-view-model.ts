import { SchedulerData } from '../api';
import { CommandService  } from '../services';
import { ICommand  } from '../commands/contracts';
import { StartSchedulerCommand, StopSchedulerCommand, PauseSchedulerCommand, ResumeSchedulerCommand, StandbySchedulerCommand } from '../commands/scheduler-commands';
import { ApplicationModel } from '../application-model';
import CommandProgressViewModel from '../command-progress/command-progress-view-model';
import Timeline from '../timeline/timeline';

import { IDialogManager } from '../dialogs/dialog-manager';
import SchedulerDetails from '../dialogs/scheduler-details/scheduler-details-view-model';

import Action from '../global/actions/action';
import CommandAction from '../command-action';
import {ScheduleJobViewModel} from '../dialogs/schedule-job/schedule-job-view-model';
import {JobGroup} from '../api';
import {SchedulerExplorer} from '../scheduler-explorer';

export default class MainHeaderViewModel {
    name = new js.ObservableValue<string>();
    instanceId = js.observableValue<string>();

    status = new js.ObservableValue<string>();
    
    startAction = new CommandAction(this.application, this.commandService, 'Start', () => new StartSchedulerCommand());
    pauseAllAction = new CommandAction(this.application, this.commandService, 'Pause All', () => new PauseSchedulerCommand());
    resumeAllAction = new CommandAction(this.application, this.commandService, 'Resume All', () => new ResumeSchedulerCommand());
    standbyAction = new CommandAction(this.application, this.commandService, 'Standby', () => new StandbySchedulerCommand());
    shutdownAction = new CommandAction(this.application, this.commandService, 'Shutdown', () => new StopSchedulerCommand(), 'Are you sure you want to shutdown scheduler?');

    scheduleJobAction = new Action(
        '+',
        () => { this.scheduleJob(); });

    commandProgress = new CommandProgressViewModel(this.commandService);

    constructor(
        public timeline: Timeline,
        private commandService: CommandService,
        private application: ApplicationModel,
        private dialogManager: IDialogManager,
        private schedulerExplorer: SchedulerExplorer) { }

    updateFrom(data: SchedulerData) {
        this.name.setValue(data.Name);
        this.instanceId.setValue(data.InstanceId);
        this.status.setValue(data.Status);

        this.startAction.enabled = data.Status === 'ready';
        this.shutdownAction.enabled = (data.Status !== 'shutdown');
        this.standbyAction.enabled = data.Status === 'started';
        this.pauseAllAction.enabled = data.Status === 'started';
        this.resumeAllAction.enabled = data.Status === 'started';
        this.scheduleJobAction.enabled = data.Status !== 'shutdown';
    }

    showSchedulerDetails() {
        this.dialogManager.showModal(new SchedulerDetails(this.commandService), result => {});
    }

    private scheduleJob() {
        this.dialogManager.showModal(new ScheduleJobViewModel(this.schedulerExplorer, this.commandService), () => {});
    }
}