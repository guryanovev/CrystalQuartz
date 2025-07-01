import { ObservableList, ObservableValue } from 'john-smith/reactive';
import { Job, JobDetails, PropertyValue } from '../../api';
import { GetJobDetailsCommand } from '../../commands/job-commands';
import { CommandService, ErrorInfo } from '../../services';
import { PlainProperty, PropertyType } from '../common/plainProperty';
import { DialogViewModel } from '../dialog-view-model';

export default class JobDetailsViewModel extends DialogViewModel<void> {
  public readonly summary = new ObservableList<PlainProperty>();
  public readonly identity = new ObservableList<PlainProperty>();
  public readonly jobDataMap = new ObservableValue<PropertyValue | null>(null);

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
          new PlainProperty('Name', this.job.Name, PropertyType.String),
          new PlainProperty('Group', this.job.GroupName, PropertyType.String),
        ]);

        if (details.JobDetails) {
          this.summary.add(
            new PlainProperty('Job type', details.JobDetails.JobType, PropertyType.Type),
            new PlainProperty('Description', details.JobDetails.Description, PropertyType.String),
            new PlainProperty(
              'Concurrent execution disallowed',
              details.JobDetails.ConcurrentExecutionDisallowed,
              PropertyType.Boolean
            ),
            new PlainProperty(
              'Persist after execution',
              details.JobDetails.PersistJobDataAfterExecution,
              PropertyType.Boolean
            ),
            new PlainProperty(
              'Requests recovery',
              details.JobDetails.RequestsRecovery,
              PropertyType.Boolean
            ),
            new PlainProperty('Durable', details.JobDetails.Durable, PropertyType.Boolean)
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
