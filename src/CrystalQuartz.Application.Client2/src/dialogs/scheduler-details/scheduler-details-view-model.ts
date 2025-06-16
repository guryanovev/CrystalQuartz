import { ObservableList } from 'john-smith/reactive';
import { SchedulerDetails } from '../../api';
import { GetSchedulerDetailsCommand } from '../../commands/scheduler-commands';
import { CommandService } from '../../services';
import { Property, PropertyType } from '../common/property';
import { DialogViewModel } from '../dialog-view-model';

export default class SchedulerDetailsViewModel extends DialogViewModel<any> {
  public summary = new ObservableList<Property>();
  public status = new ObservableList<Property>();
  public jobStore = new ObservableList<Property>();
  public threadPool = new ObservableList<Property>();

  public constructor(private commandService: CommandService) {
    super();
  }

  public loadDetails() {
    this.commandService
      .executeCommand<SchedulerDetails>(new GetSchedulerDetailsCommand())
      .then((response) => {
        const data = response;

        this.summary.add(
          new Property('Scheduler name', data.SchedulerName, PropertyType.String),
          new Property('Scheduler instance id', data.SchedulerInstanceId, PropertyType.String),
          new Property('Scheduler remote', data.SchedulerRemote, PropertyType.Boolean),
          new Property('Scheduler type', data.SchedulerType, PropertyType.Type),
          new Property('Version', data.Version, PropertyType.String)
        );

        this.status.add(
          new Property('In standby mode', data.InStandbyMode, PropertyType.Boolean),
          new Property('Shutdown', data.Shutdown, PropertyType.Boolean),
          new Property('Started', data.Started, PropertyType.Boolean),
          new Property('Jobs executed', data.NumberOfJobsExecuted, PropertyType.Numeric),
          new Property('Running since', data.RunningSince, PropertyType.Date)
        ); // todo

        this.jobStore.add(
          new Property('Job store clustered', data.JobStoreClustered, PropertyType.Boolean),
          new Property(
            'Job store supports persistence',
            data.JobStoreSupportsPersistence,
            PropertyType.Boolean
          ),
          new Property('Job store type', data.JobStoreType, PropertyType.Type)
        ); // todo

        this.threadPool.add(
          new Property('Thread pool size', data.ThreadPoolSize, PropertyType.Numeric),
          new Property('Thread pool type', data.ThreadPoolType, PropertyType.Type)
        ); // todo
      });
  }
}
