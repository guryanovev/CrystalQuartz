import { Disposable } from 'john-smith/common';
import { BidirectionalValue, ObservableList } from 'john-smith/reactive';
import { map } from 'john-smith/reactive/transformers/map';
import { TypeInfo } from '../../../api';
import { SchedulerExplorer } from '../../../scheduler-explorer';
import { NULL_IF_EMPTY } from '../../../utils/string';
import { SelectOption } from '../../common/select-option';
import { Validators } from '../../common/validation/validators';
import { ValidatorsFactory } from '../../common/validation/validators-factory';
import { ConfigurationStep, ConfigurationStepData } from './configuration-step';

export class JobType {
  public static Existing = 'existing';
  public static New = 'new';
}

export class JobConfigurationStep implements ConfigurationStep, Disposable {
  public readonly code = 'job';
  public readonly navigationLabel = 'Configure Job';

  public readonly jobType = new BidirectionalValue<string | null>((_) => true, null);
  public readonly jobTypeOptions = new ObservableList<SelectOption>();
  public readonly existingJobs = new ObservableList<SelectOption>();
  public readonly selectedJob = new BidirectionalValue<string | null>((_) => true, null);
  public readonly newJobName = new BidirectionalValue<string>((_) => true, '');
  public readonly newJobClass = new BidirectionalValue<string>((_) => true, '');
  public readonly allowedJobTypes = new ObservableList<SelectOption>();

  public readonly validators = new Validators();
  public readonly newJobClassValidator = this.validators.register(
    {
      source: this.newJobClass,
      condition: map(this.jobType, (x) => x === JobType.New),
    },
    ValidatorsFactory.required('Please select a Job Class')
  );
  public readonly selectedJobValidator = this.validators.register(
    {
      source: this.selectedJob,
      condition: map(this.jobType, (x) => x === JobType.Existing),
    },
    ValidatorsFactory.required('Please select a Job')
  );

  public constructor(
    private schedulerExplorer: SchedulerExplorer,
    allowedJobTypes: TypeInfo[]
  ) {
    const values = allowedJobTypes.map((type) => {
      const formattedType = type.Namespace + '.' + type.Name + ', ' + type.Assembly;
      return { value: formattedType, title: formattedType };
    });

    this.allowedJobTypes.setValue([{ value: '', title: '- Select a Job Class -' }, ...values]);
  }

  public onEnter(data: ConfigurationStepData): ConfigurationStepData {
    const selectedJobGroupName = data.groupName || 'Default';

    const jobGroup = this.schedulerExplorer
      .listGroups()
      .find((x) => x.Name === selectedJobGroupName);

    const options: SelectOption[] = [{ title: 'Define new job', value: JobType.New }];

    const canUseExistingJob = jobGroup && jobGroup.Jobs && jobGroup.Jobs.length > 0;
    if (canUseExistingJob) {
      options.push({ title: 'Use existing job', value: JobType.Existing });

      const existingJobsOption = [
        { value: '', title: '- Select a Job -' },
        ...jobGroup.Jobs.map((j) => ({ value: j.Name, title: j.Name })),
      ];

      this.existingJobs.setValue(existingJobsOption);
      this.selectedJob.setValue(this.selectedJob.getValue());
    }

    const currentJobType = this.jobType.getValue();
    const existingJobType = currentJobType === JobType.Existing;
    const shouldResetSelectedJob =
      existingJobType &&
      (!jobGroup || !jobGroup.Jobs.find((j) => j.Name === this.selectedJob.getValue()));

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

    // workarounds for selects caused by the fact that the value is set before
    // options rendered
    this.newJobClass.mutate((_) => _);
    this.selectedJob.mutate((_) => _);

    return data;
  }

  public onLeave(data: ConfigurationStepData): ConfigurationStepData {
    return {
      groupName: data.groupName,
      jobName: this.getJobName(),
      jobClass: this.getJobClass(),
    };
  }

  public getJobName(): string | null {
    const jobType = this.jobType.getValue();

    switch (jobType) {
      case JobType.New: {
        return NULL_IF_EMPTY(this.newJobName.getValue());
      }
      case JobType.Existing: {
        return this.selectedJob.getValue();
      }
      default: {
        throw new Error('Unknown job type ' + jobType);
      }
    }
  }

  public getJobClass(): string | null {
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

  public dispose() {
    this.validators.dispose();
  }
}
