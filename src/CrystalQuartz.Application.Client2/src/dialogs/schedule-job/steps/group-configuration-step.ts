import { Disposable } from 'john-smith/common';
import { BidirectionalValue, ObservableList } from 'john-smith/reactive';
import { map } from 'john-smith/reactive/transformers/map';
import { SchedulerExplorer } from '../../../scheduler-explorer';
import { NULL_IF_EMPTY } from '../../../utils/string';
import { SelectOption } from '../../common/select-option';
import { Validators } from '../../common/validation/validators';
import { ValidatorsFactory } from '../../common/validation/validators-factory';
import { ConfigurationStep, ConfigurationStepData } from './configuration-step';

export class JobGroupType {
  public static None = 'none';
  public static Existing = 'existing';
  public static New = 'new';
}

export class GroupConfigurationStep implements ConfigurationStep, Disposable {
  public readonly code = 'group';
  public readonly navigationLabel = 'Configure Group';

  public readonly jobGroupType = new BidirectionalValue<string>((_) => true, JobGroupType.None);
  public readonly jobGroupTypeOptions = new ObservableList<SelectOption>();
  public readonly existingJobGroups = new ObservableList<SelectOption>();
  public readonly selectedJobGroup = new BidirectionalValue<string>((_) => true, '');
  public readonly newJobGroup = new BidirectionalValue<string>((_) => true, '');

  public readonly validators = new Validators();

  public constructor(schedulerExplorer: SchedulerExplorer) {
    const groups = schedulerExplorer.listGroups().map((g) => ({ value: g.Name, title: g.Name }));

    this.existingJobGroups.setValue([{ value: '', title: '- Select a Job Group -' }, ...groups]);

    this.jobGroupTypeOptions.add({
      value: JobGroupType.None,
      title: 'Not specified (Use default)',
    });

    if (groups.length > 0) {
      this.jobGroupTypeOptions.add({ value: JobGroupType.Existing, title: 'Use existing group' });
    }

    this.jobGroupTypeOptions.add({ value: JobGroupType.New, title: 'Define new group' });

    this.jobGroupType.setValue(JobGroupType.None);

    this.validators.register(
      {
        source: this.selectedJobGroup,
        condition: map(this.jobGroupType, (x) => x === JobGroupType.Existing),
      },
      ValidatorsFactory.required('Please select a group')
    );
  }

  public onEnter(data: ConfigurationStepData): ConfigurationStepData {
    // workarounds for selects caused by the fact that the value is set before
    // options rendered
    this.jobGroupType.mutate((_) => _);
    this.selectedJobGroup.mutate((_) => _);

    return data;
  }

  public onLeave(data: ConfigurationStepData): ConfigurationStepData {
    return {
      groupName: this.getGroupName(),
      jobClass: data.jobClass,
      jobName: data.jobName,
    };
  }

  public getGroupName(): string | null {
    const jobGroupType = this.jobGroupType.getValue();

    if (jobGroupType === JobGroupType.None) {
      return null;
    } else if (jobGroupType === JobGroupType.Existing) {
      return this.selectedJobGroup.getValue();
    } else if (jobGroupType === JobGroupType.New) {
      return NULL_IF_EMPTY(this.newJobGroup.getValue());
    }

    return null;
  }

  public dispose() {
    this.validators.dispose();
  }
}
