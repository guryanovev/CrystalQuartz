import { DialogViewModel } from '../dialog-view-model';
import { CommandService, ErrorInfo } from '../../services';
import { Job, JobDetails, PropertyValue } from '../../api';
import { GetJobDetailsCommand } from '../../commands/job-commands';
import { Property, PropertyType } from '../common/property';

export default class JobDetailsViewModel extends DialogViewModel<any> {
    summary = new js.ObservableList<Property>();
    identity = new js.ObservableList<Property>();
    jobDataMap = new js.ObservableValue<PropertyValue>();

    constructor(
        private job: Job,
        private commandService: CommandService) {

        super();
    }

    loadDetails() {
        this.commandService
            .executeCommand<JobDetails>(new GetJobDetailsCommand(this.job.GroupName, this.job.Name), true)
            .done(details => {
                this.identity.setValue([
                    new Property('Name', this.job.Name, PropertyType.String),
                    new Property('Group', this.job.GroupName, PropertyType.String)
                ]);

                if (details.JobDetails) {
                    this.summary.add(
                        new Property('Job type', details.JobDetails.JobType, PropertyType.Type),
                        new Property('Description', details.JobDetails.Description, PropertyType.String),
                        new Property('Concurrent execution disallowed',
                            details.JobDetails.ConcurrentExecutionDisallowed,
                            PropertyType.Boolean),
                        new Property('Persist after execution',
                            details.JobDetails.PersistJobDataAfterExecution,
                            PropertyType.Boolean),
                        new Property('Requests recovery', details.JobDetails.RequestsRecovery, PropertyType.Boolean),
                        new Property('Durable', details.JobDetails.Durable, PropertyType.Boolean));

                    this.jobDataMap.setValue(details.JobDataMap);

                    this.state.setValue('ready');
                } else {
                    this.goToErrorState('No details found, the Job no longer available.')
                }
            })
            .fail((error: ErrorInfo) => {
                this.goToErrorState(error.errorMessage);
            });
    }
}