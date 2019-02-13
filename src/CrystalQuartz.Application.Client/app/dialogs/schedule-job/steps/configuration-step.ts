import {Validators} from '../../common/validation/validators';

export interface ConfigurationStepData {
    groupName: string|null;
    jobName: string|null;
    jobClass: string|null;
}

export interface ConfigurationStep {
    code: string;
    navigationLabel: string;
    onEnter?: (data: ConfigurationStepData) => ConfigurationStepData;
    onLeave?: (data: ConfigurationStepData) => ConfigurationStepData;
    validators?: Validators;
}