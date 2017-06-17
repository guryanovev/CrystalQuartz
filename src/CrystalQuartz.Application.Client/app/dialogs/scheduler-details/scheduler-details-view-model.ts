import { IDialogViewModel } from '../dialog-view-model';
import { CommandService } from '../../services';
import { SchedulerDetails } from '../../api';
import { GetSchedulerDetailsCommand } from '../../commands/scheduler-commands';

import { Property, PropertyType } from '../common/property';

export default class SchedulerDetailsViewModel implements IDialogViewModel<any> {
    accepted = new js.Event<any>(); /* todo: base class */
    canceled = new js.Event<any>();

    cancel() {
        this.canceled.trigger();
    }

    summary = new js.ObservableList<Property>();
    status = new js.ObservableList<Property>();
    jobStore = new js.ObservableList<Property>();
    threadPool = new js.ObservableList<Property>();

    constructor(
        private commandService: CommandService) {
    }

    loadDetails() {
        this.commandService
            .executeCommand<SchedulerDetails>(new GetSchedulerDetailsCommand())
            .then((data:SchedulerDetails) => {
                this.summary.add(
                    new Property('Scheduler name', data.SchedulerName, PropertyType.String),
                    new Property('Scheduler instance id', data.SchedulerInstanceId, PropertyType.String),
                    new Property('Scheduler remote', data.SchedulerRemote, PropertyType.Boolean),
                    new Property('Scheduler type', data.SchedulerType, PropertyType.Type),
                    new Property('Version', data.Version, PropertyType.String));

                this.status.add(
                    new Property('In standby mode', data.InStandbyMode, PropertyType.Boolean),
                    new Property('Shutdown', data.Shutdown, PropertyType.Boolean),
                    new Property('Started', data.Started, PropertyType.Boolean),
                    new Property('Jobs executed', data.NumberOfJobsExecuted, PropertyType.Numeric),
                    new Property('Running since', data.RunningSince, PropertyType.String)); // todo

                this.jobStore.add(
                    new Property('Job store clustered', data.JobStoreClustered, PropertyType.Boolean),
                    new Property('Job store supports persistence', data.JobStoreSupportsPersistence, PropertyType.Boolean),
                    new Property('Job store type', data.JobStoreType, PropertyType.Type)); // todo

                this.threadPool.add(
                    new Property('Thread pool size', data.ThreadPoolSize, PropertyType.Numeric),
                    new Property('Thread pool type', data.ThreadPoolType, PropertyType.Type)); // todo
            });
    }
}