import { ConfigurationStep, ConfigurationStepData } from './configuration-step';
import { SelectOption } from '../../common/select-option';
import { SchedulerExplorer } from '../../../scheduler-explorer';
import { Validators } from '../../common/validation/validators';

import { ValidatorsFactory } from '../../common/validation/validators-factory';
import { BidirectionalValue, ObservableList, ObservableValue } from 'john-smith/reactive';
import { Owner } from 'john-smith/common';
import { map } from 'john-smith/reactive/transformers/map';

export class JobGroupType {
    static None = 'none';
    static Existing = 'existing';
    static New = 'new';
}

export class GroupConfigurationStep /*extends Owner*/ implements ConfigurationStep {
    code = 'group';
    navigationLabel = 'Configure Group';

    jobGroupType = new BidirectionalValue<string>(value => true, JobGroupType.None);
    jobGroupTypeOptions = new ObservableList<SelectOption>();
    existingJobGroups = new ObservableList<SelectOption>();
    selectedJobGroup = new ObservableValue<string>('');
    newJobGroup = new ObservableValue<string>('');

    validators = new Validators();

    constructor(
        private schedulerExplorer: SchedulerExplorer) {

        // super();

        const groups = schedulerExplorer.listGroups().map(g => ({ value: g.Name, title: g.Name}));

        this.existingJobGroups.setValue([
            { value: '', title: '- Select a Job Group -'},
            ...groups
        ]);

        this.jobGroupTypeOptions.add({ value: JobGroupType.None, title: 'Not specified (Use default)' });
        if (groups.length > 0) {
            this.jobGroupTypeOptions.add({ value: JobGroupType.Existing, title: 'Use existing group' });
        }

        this.jobGroupTypeOptions.add({ value: JobGroupType.New, title: 'Define new group' });

        this.jobGroupType.setValue(JobGroupType.None);

        this.validators.register(
            {
                source: this.selectedJobGroup,
                condition: map(this.jobGroupType, x => x === JobGroupType.Existing)
            },
            ValidatorsFactory.required('Please select a group'));

        //this.own(this.validators);
    }

    onLeave(data: ConfigurationStepData): ConfigurationStepData {
        return {
            groupName: this.getGroupName(),
            jobClass: data.jobClass,
            jobName: data.jobName
        }
    }

    getGroupName(): string|null {
        const jobGroupType = this.jobGroupType.getValue();

        if (jobGroupType === JobGroupType.None) {
            return null;
        } else if (jobGroupType === JobGroupType.Existing) {
            return this.selectedJobGroup.getValue();
        } else if (jobGroupType === JobGroupType.New) {
            return this.newJobGroup.getValue();
        }

        return null;
    }

    releaseState() {
        //this.dispose();
    }
}
