import { DialogViewModel } from '../dialog-view-model';
import { CommandService } from '../../services';
import { Job, JobDetails } from '../../api';
import { GetJobDetailsCommand } from '../../commands/job-commands';
import { Property, PropertyType } from '../common/property';

export default class JobDetailsViewModel extends DialogViewModel<any> {
    summary = new js.ObservableList<Property>();
    jobDataMap = new js.ObservableValue<any>();

    constructor(
        private job: Job,
        private commandService: CommandService) {

        super();
    }

    loadDetails() {
        this.commandService
            .executeCommand<JobDetails>(new GetJobDetailsCommand(this.job.GroupName, this.job.Name))
            .done(details => {
                this.summary.add(
                    new Property('Job type', details.JobDetails.JobType, PropertyType.Type),
                    new Property('Description', details.JobDetails.Description, PropertyType.String),
                    new Property('Concurrent execution disallowed', details.JobDetails.ConcurrentExecutionDisallowed, PropertyType.Boolean),
                    new Property('Persist after execution', details.JobDetails.PersistJobDataAfterExecution, PropertyType.Boolean),
                    new Property('Requests recovery', details.JobDetails.RequestsRecovery, PropertyType.Boolean),
                    new Property('Durable', details.JobDetails.Durable, PropertyType.Boolean));

                this.jobDataMap.setValue(details.JobDataMap);
            });
    }
}