import { ConfigurationStep, ConfigurationStepData } from './configuration-step';
import { SelectOption } from '../../common/select-option';

import __map from 'lodash/map';
import __find from 'lodash/find';
import { SchedulerExplorer } from '../../../scheduler-explorer';
import { TypeInfo } from '../../../api';
import { Validators } from '../../common/validation/validators';
import { MAP } from '../../../global/map';
import { JobGroupType } from './group-configuration-step';
import { ValidatorsFactory } from '../../common/validation/validators-factory';
import {Owner} from '../../../global/owner';

export class JobType {
    static Existing = 'existing';
    static New = 'new';
}

export class JobConfigurationStep extends Owner implements ConfigurationStep {
    code = 'job';
    navigationLabel = 'Configure Job';

    jobType = new js.ObservableValue<string>();
    jobTypeOptions = new js.ObservableList<SelectOption>();
    existingJobs = new js.ObservableList<string>();
    selectedJob = new js.ObservableValue<string>();
    newJobName = new js.ObservableValue<string>();
    newJobClass = new js.ObservableValue<string>();
    allowedJobTypes = new js.ObservableList<SelectOption>();

    validators = new Validators();

    constructor(
        private schedulerExplorer: SchedulerExplorer,
        allowedJobTypes: TypeInfo[]) {

        super();

        const values = __map(
            allowedJobTypes,
            type => {
                const formattedType = type.Namespace + '.' + type.Name + ', ' + type.Assembly;
                return ({ value: formattedType, title: formattedType });
            });

        this.allowedJobTypes.setValue(values);

        this.validators.register(
            {
                source: this.selectedJob,
                condition: this.own(MAP(this.jobType, x => x === JobType.Existing))
            },
            ValidatorsFactory.required('Please select a Job'));

        this.validators.register(
            {
                source: this.newJobClass,
                condition: this.own(MAP(this.jobType, x => x === JobType.New))
            },
            ValidatorsFactory.required('Please select a Job Class'));

        this.own(this.validators);
    }

    onEnter(data: ConfigurationStepData): ConfigurationStepData {
        const
            selectedJobGroupName = data.groupName || 'Default',
            jobGroup = __find(this.schedulerExplorer.listGroups(), x => x.Name === selectedJobGroupName),
            options: SelectOption[] = [
                { title: 'Define new job', value: JobType.New }
            ];

        const canUseExistingJob = jobGroup && jobGroup.Jobs && jobGroup.Jobs.length > 0;
        if (canUseExistingJob) {
            options.push({ title: 'Use existing job', value: JobType.Existing });
            this.existingJobs.setValue(__map(jobGroup.Jobs, j => j.Name));
        }

        const
            currentJobType = this.jobType.getValue(),
            existingJobType = currentJobType === JobType.Existing,
            shouldResetSelectedJob = existingJobType &&
                ((!jobGroup) ||
                    !__find(jobGroup.Jobs, j => j.Name === this.selectedJob.getValue()));

        if (shouldResetSelectedJob) {
            this.selectedJob.setValue(null);
        }

        this.jobTypeOptions.setValue(options);

        const shouldResetJobType = currentJobType == null || (!canUseExistingJob && existingJobType);

        if (shouldResetJobType) {
            this.jobType.setValue(JobType.New);
        } else {
            this.jobType.setValue(currentJobType);
        }

        return data;
    }

    onLeave(data: ConfigurationStepData): ConfigurationStepData {
        return {
            groupName: data.groupName,
            jobName: this.getJobName(),
            jobClass: this.getJobClass()
        };
    }

    getJobName(): string {
        const jobType = this.jobType.getValue();

        switch (jobType) {
            case JobType.New: {
                return this.newJobName.getValue();
            }
            case JobType.Existing: {
                return this.selectedJob.getValue();
            }
            default: {
                throw new Error('Unknown job type ' + jobType);
            }
        }
    }

    getJobClass(): string | null {
        const jobType = this.jobType.getValue();

        switch (jobType) {
            case JobType.New: {
                return this.newJobClass.getValue();
            }
            case JobType.Existing: {
                return null;
            }
            default: {
                throw new Error('Unknown job type ' + jobType);
            }
        }
    }

    releaseState() {
        this.dispose();
    }
}