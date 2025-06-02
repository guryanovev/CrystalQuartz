import { IDialogViewModel } from '../dialog-view-model';
import { SchedulerExplorer } from '../../scheduler-explorer';

import { CommandService } from '../../services';
import { GetJobTypesCommand } from '../../commands/trigger-commands';
import { TypeInfo } from '../../api';
import { ConfigurationStep, ConfigurationStepData } from './steps/configuration-step';
// import { GroupConfigurationStep } from './steps/group-configuration-step';
// import { JobConfigurationStep } from './steps/job-configuration-step';
// import { TriggerConfigurationStep } from './steps/trigger-configuration-step';
import { AddTriggerCommand } from '../../commands/trigger-commands';
import { AddTriggerResult } from '../../commands/trigger-commands';
import { IAddTriggerForm } from '../../commands/trigger-commands';
import { Owner } from 'john-smith/common';
import { ObservableValue } from 'john-smith/reactive';
import { Event } from 'john-smith/reactive/event';
import { GroupConfigurationStep } from './steps/group-configuration-step';
import { JobConfigurationStep } from './steps/job-configuration-step';
import { TriggerConfigurationStep } from './steps/trigger-configuration-step';

export interface ScheduleJobOptions {
    predefinedGroup?: string;
    predefinedJob?: string;
}

export class ConfigarationState {
    static Loading = 'loading';
    static Ready = 'ready';
    static Error = 'error';
}

type None = {};
const NoneInstance: None = {};

export class ScheduleJobViewModel /*extends Owner*/ implements IDialogViewModel<any>/*, js.IViewModel */ {
    private _steps: ConfigurationStep[] = [];
    private _currentData!: ConfigurationStepData;
    private _finalStep: TriggerConfigurationStep;

    isSaving = new ObservableValue<boolean>(false);

    currentStep = new ObservableValue<ConfigurationStep | null>(null);
    previousStep = new ObservableValue<ConfigurationStep | null>(null);
    nextStep = new ObservableValue<ConfigurationStep | null>(null);

    state = new ObservableValue<string | null>(null);

    accepted = new Event<any>(); /* todo: base class */
    canceled = new Event<any>();

    constructor(
        private schedulerExplorer: SchedulerExplorer,
        private commandService: CommandService,
        private options: ScheduleJobOptions = {}) {

        //super();
        this._finalStep = new TriggerConfigurationStep(this.commandService);
    }

    private initConfigSteps(allowedJobTypes: TypeInfo[]) {
        if (allowedJobTypes.length === 0) {
            this.state.setValue(ConfigarationState.Error);
            return;
        }

        this._currentData = {
            groupName: this.options.predefinedGroup || null,
            jobName: this.options.predefinedJob || null,
            jobClass: null
        };

        const steps: ConfigurationStep[] = [];

        if (this._currentData.groupName === null) {
            steps.push(new GroupConfigurationStep(this.schedulerExplorer));
        }

        if (this._currentData.jobName === null) {
            steps.push(new JobConfigurationStep(this.schedulerExplorer, allowedJobTypes));
        }

        steps.push(this._finalStep);

        this._steps = steps;

        this.setCurrentStep(this._steps[0]);

        this.state.setValue(ConfigarationState.Ready);
    }

    initState(): void {
        this.state.setValue(ConfigarationState.Loading);

        this.commandService
            .executeCommand(new GetJobTypesCommand())
            .then(data => { this.initConfigSteps(data); });
    }

    releaseState() {
    }

    cancel() {
        this.canceled.trigger({});
    }

    goBackOrCancel() {
        const previousStep = this.previousStep.getValue();
        if (previousStep) {
            this.setCurrentStep(this.previousStep.getValue()!);
        } else {
            this.cancel();
        }
    }

    goNextOrSave() {
        const currentStep = this.currentStep.getValue();
        if (currentStep && currentStep.validators && !currentStep.validators.validate()) {
            return false;
        }

        let nextStep = this.nextStep.getValue();
        if (nextStep !== null) {
            this.setCurrentStep(nextStep as ConfigurationStep);
        } else {
            if (this.isSaving.getValue()) {
                return false;
            }

            this.save();
        }

        return true;
    }

    private save() {
        this.isSaving.setValue(true);

        const form: IAddTriggerForm = {
            ...this._finalStep.composeTriggerStepData(),
            group: this._currentData.groupName,
            job: this._currentData.jobName,
            jobClass: this._currentData.jobClass!
        };

        this.commandService
            .executeCommand(new AddTriggerCommand(form))
            .then((result: AddTriggerResult) => {
                if (result.validationErrors) {
                    this._finalStep.displayValidationErrors(result.validationErrors);
                } else {
                    this.accepted.trigger(true);
                }
            })
            .finally(() => {
                this.isSaving.setValue(false);
            })
            // .fail((reason) => {
            //     /* todo */
            // });
    }

    private setCurrentStep(step: ConfigurationStep) {
        const previousStep = this.currentStep.getValue();

        if (previousStep && previousStep.onLeave) {
            this._currentData = previousStep.onLeave(this._currentData);
        }

        if (step.validators) {
            step.validators.markPristine();
        }

        this.currentStep.setValue(step);
        if (step.onEnter) {
            this._currentData = step.onEnter(this._currentData);
        }

        const stepIndex = this._steps.indexOf(step);

        this.previousStep.setValue(stepIndex > 0 ? this._steps[stepIndex - 1] : null);
        this.nextStep.setValue(stepIndex < this._steps.length - 1 ? this._steps[stepIndex + 1] : null);
    }
}
