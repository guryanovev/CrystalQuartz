import { Owner } from 'john-smith/common';
import { BidirectionalValue, ObservableList, ObservableValue } from 'john-smith/reactive';
import { map } from 'john-smith/reactive/transformers/map';
import { SchedulerExplorer } from '../../../scheduler-explorer';
import { NULL_IF_EMPTY } from '../../../utils/string';
import { SelectOption } from '../../common/select-option';
import { Validators } from '../../common/validation/validators';
import { ValidatorsFactory } from '../../common/validation/validators-factory';
import { ConfigurationStep, ConfigurationStepData } from './configuration-step';

export class JobGroupType {
  static None = 'none';
  static Existing = 'existing';
  static New = 'new';
}

export class GroupConfigurationStep /*extends Owner*/ implements ConfigurationStep {
  public code = 'group';
  public navigationLabel = 'Configure Group';

  public jobGroupType = new BidirectionalValue<string>((value) => true, JobGroupType.None);
  public jobGroupTypeOptions = new ObservableList<SelectOption>();
  public existingJobGroups = new ObservableList<SelectOption>();
  public selectedJobGroup = new BidirectionalValue<string>((value) => true, '');
  public newJobGroup = new BidirectionalValue<string>((value) => true, '');

  public validators = new Validators();

  public constructor(private schedulerExplorer: SchedulerExplorer) {
    // super();

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

    //this.own(this.validators);
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

  public releaseState() {
    //this.dispose();
  }
}
