import { ObservableList } from 'john-smith/reactive';
import { SchedulerDetails } from '../../api';
import { GetSchedulerDetailsCommand } from '../../commands/scheduler-commands';
import { CommandService } from '../../services';
import { PlainProperty, PropertyType } from '../common/plainProperty';
import { DialogViewModel } from '../dialog-view-model';

export default class SchedulerDetailsViewModel extends DialogViewModel<void> {
  public summary = new ObservableList<PlainProperty>();
  public status = new ObservableList<PlainProperty>();
  public jobStore = new ObservableList<PlainProperty>();
  public threadPool = new ObservableList<PlainProperty>();

  public constructor(private commandService: CommandService) {
    super();
  }

  public loadDetails() {
    this.commandService
      .executeCommand<SchedulerDetails>(new GetSchedulerDetailsCommand())
      .then((response) => {
        const data = response;

        this.summary.add(
          new PlainProperty('Scheduler name', data.SchedulerName, PropertyType.String),
          new PlainProperty('Scheduler instance id', data.SchedulerInstanceId, PropertyType.String),
          new PlainProperty('Scheduler remote', data.SchedulerRemote, PropertyType.Boolean),
          new PlainProperty('Scheduler type', data.SchedulerType, PropertyType.Type),
          new PlainProperty('Version', data.Version, PropertyType.String)
        );

        this.status.add(
          new PlainProperty('In standby mode', data.InStandbyMode, PropertyType.Boolean),
          new PlainProperty('Shutdown', data.Shutdown, PropertyType.Boolean),
          new PlainProperty('Started', data.Started, PropertyType.Boolean),
          new PlainProperty('Jobs executed', data.NumberOfJobsExecuted, PropertyType.Numeric),
          new PlainProperty('Running since', data.RunningSince, PropertyType.Date)
        ); // todo

        this.jobStore.add(
          new PlainProperty('Job store clustered', data.JobStoreClustered, PropertyType.Boolean),
          new PlainProperty(
            'Job store supports persistence',
            data.JobStoreSupportsPersistence,
            PropertyType.Boolean
          ),
          new PlainProperty('Job store type', data.JobStoreType, PropertyType.Type)
        ); // todo

        this.threadPool.add(
          new PlainProperty('Thread pool size', data.ThreadPoolSize, PropertyType.Numeric),
          new PlainProperty('Thread pool type', data.ThreadPoolType, PropertyType.Type)
        ); // todo
      });
  }
}
