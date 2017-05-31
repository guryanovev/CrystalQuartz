import { SchedulerData } from '../api';
import { CommandService } from '../services';
import { StartSchedulerCommand, StopSchedulerCommand } from '../commands/scheduler-commands';
import { ApplicationModel } from '../application-model';
import Timeline from '../timeline/timeline';

export default class MainHeaderViewModel {
    name = new js.ObservableValue<string>();
    instanceId = js.observableValue<string>();
    status = new js.ObservableValue<string>();
    canStart = new js.ObservableValue<boolean>();
    canShutdown = new js.ObservableValue<boolean>();
    isRemote = new js.ObservableValue<boolean>();
    schedulerType = new js.ObservableValue<string>();

    constructor(
        public timeline: Timeline,
        private commandService: CommandService,
        private application: ApplicationModel) { }

    updateFrom(data: SchedulerData) {
        this.name.setValue(data.Name);
        this.instanceId.setValue(data.InstanceId);
        this.status.setValue(data.Status);
        this.canStart.setValue(data.Status === 'ready');
        this.canShutdown.setValue(data.Status !== 'shutdown');
        this.isRemote.setValue(data.IsRemote);
        this.schedulerType.setValue(data.SchedulerTypeName);
    }

    startScheduler() {
        if (this.canStart.getValue()) {
            this.commandService
                .executeCommand<SchedulerData>(new StartSchedulerCommand())
                .done(data => this.application.setData(data));
        }
    }

    stopScheduler() {
        if (this.canShutdown.getValue()) {
            this.commandService
                .executeCommand<SchedulerData>(new StopSchedulerCommand())
                .done(data => this.application.setData(data));
        }
    }
}