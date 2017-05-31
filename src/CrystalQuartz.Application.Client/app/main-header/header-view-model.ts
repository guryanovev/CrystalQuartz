import { SchedulerData } from '../api';
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
        public timeline: Timeline) { }

    updateFrom(data: SchedulerData) {
        this.name.setValue(data.Name);
        this.instanceId.setValue(data.InstanceId);
        this.status.setValue(data.Status);
        this.canStart.setValue(data.CanStart);
        this.canShutdown.setValue(data.CanShutdown);
        this.isRemote.setValue(data.IsRemote);
        this.schedulerType.setValue(data.SchedulerTypeName);
    }
}