import { ObservableList, ObservableValue } from 'john-smith/reactive';
import { Job, JobDetails, PropertyValue } from '../../api';
import { GetJobDetailsCommand } from '../../commands/job-commands';
import { CommandService, ErrorInfo } from '../../services';
import { Property, PropertyType } from '../common/property';
import { DialogViewModel } from '../dialog-view-model';

export default class JobDetailsViewModel extends DialogViewModel<void> {
  public summary = new ObservableList<Property>();
  public identity = new ObservableList<Property>();
  public jobDataMap = new ObservableValue<PropertyValue | null>(null);

  public constructor(
    private job: Job,
    private commandService: CommandService
  ) {
    super();
  }

  public loadDetails() {
    this.commandService
      .executeCommand<JobDetails>(new GetJobDetailsCommand(this.job.GroupName, this.job.Name), true)
      .then((details) => {
        this.identity.setValue([
          new Property('Name', this.job.Name, PropertyType.String),
          new Property('Group', this.job.GroupName, PropertyType.String),
        ]);

        if (details.JobDetails) {
          this.summary.add(
            new Property('Job type', details.JobDetails.JobType, PropertyType.Type),
            new Property('Description', details.JobDetails.Description, PropertyType.String),
            new Property(
              'Concurrent execution disallowed',
              details.JobDetails.ConcurrentExecutionDisallowed,
              PropertyType.Boolean
            ),
            new Property(
              'Persist after execution',
              details.JobDetails.PersistJobDataAfterExecution,
              PropertyType.Boolean
            ),
            new Property(
              'Requests recovery',
              details.JobDetails.RequestsRecovery,
              PropertyType.Boolean
            ),
            new Property('Durable', details.JobDetails.Durable, PropertyType.Boolean)
          );

          this.jobDataMap.setValue(details.JobDataMap);

          this.state.setValue('ready');
        } else {
          this.goToErrorState('No details found, the Job no longer available.');
        }
      })
      .catch((error: ErrorInfo) => {
        this.goToErrorState(error.errorMessage);
      });
  }
}
