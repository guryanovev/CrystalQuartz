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

export default class MainHeaderViewModel {
    name = new js.ObservableValue<string>();
    instanceId = js.observableValue<string>();

    status = new js.ObservableValue<string>();

    /*canStart = new js.ObservableValue<boolean>();*/

    /*
    canShutdown = new js.ObservableValue<boolean>();
    canStandby = new js.ObservableValue<boolean>();*/

    isRemote = new js.ObservableValue<boolean>();
    schedulerType = new js.ObservableValue<string>();

    startAction = this.createCommandAction('Start', new StartSchedulerCommand());
    pauseAllAction = this.createCommandAction('Pause All', new PauseSchedulerCommand());
    resumeAllAction = this.createCommandAction('Resume All', new ResumeSchedulerCommand());
    standbyAction = this.createCommandAction('Standby', new StandbySchedulerCommand());
    shutdownAction = this.createCommandAction('Shutdown', new StandbySchedulerCommand());

    actions = [
        this.pauseAllAction,
        this.resumeAllAction,
        this.standbyAction,
        this.shutdownAction
    ];

    commandProgress = new CommandProgressViewModel(this.commandService);

    constructor(
        public timeline: Timeline,
        private commandService: CommandService,
        private application: ApplicationModel,
        private dialogManager: IDialogManager) { }

    updateFrom(data: SchedulerData) {
        this.name.setValue(data.Name);
        this.instanceId.setValue(data.InstanceId);
        this.status.setValue(data.Status);

        this.isRemote.setValue(data.IsRemote);
        this.schedulerType.setValue(data.SchedulerTypeName);

        //this.canStart.setValue(data.Status === 'ready');

        this.startAction.enabled = data.Status === 'ready';
        this.shutdownAction.enabled = (data.Status !== 'shutdown');
        this.standbyAction.enabled = data.Status === 'started';
        this.pauseAllAction.enabled = data.Status === 'started';
        this.resumeAllAction.enabled = data.Status === 'started';

//        this.canShutdown.setValue(data.Status !== 'shutdown');
//        this.canStandby.setValue(data.Status !== 'ready');
    }

    /*
    startScheduler() {
        if (this.canStart.getValue()) {
            this.commandService
                .executeCommand<SchedulerData>(new StartSchedulerCommand())
                .done(data => this.application.setData(data));
        }
    }*/

    /*
    stopScheduler() {
        if (this.canShutdown.getValue()) {
            this.commandService
                .executeCommand<SchedulerData>(new StopSchedulerCommand())
                .done(data => this.application.setData(data));
        }
    }*/

    showSchedulerDetails() {
        this.dialogManager.showModal(new SchedulerDetails(this.commandService), result => {});
    }

    private createCommandAction(title: string, command: ICommand<SchedulerData>) {
        return new Action(
            title,
            () => this.commandService
                .executeCommand(command)
                .done(data => this.application.setData(data)));
    }
}