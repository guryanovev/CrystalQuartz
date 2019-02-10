import { Owner } from '../../global/owner';
import { IDialogViewModel } from '../dialog-view-model';
import { SchedulerExplorer } from '../../scheduler-explorer';

import { CommandService } from '../../services';
import { GetJobTypesCommand } from '../../commands/trigger-commands';
import { TypeInfo } from '../../api';
import { ConfigurationStep, ConfigurationStepData } from './steps/configuration-step';
import {GroupConfigurationStep} from './steps/group-configuration-step';
import {JobConfigurationStep} from './steps/job-configuration-step';
import {TriggerConfigurationStep} from './steps/trigger-configuration-step';

export class ConfigarationState {
    static Loading = 'loading';
    static Ready = 'ready';
    static Error = 'error';
}

export class ScheduleJobViewModel extends Owner implements IDialogViewModel<any>, js.IViewModel {
    private _steps: ConfigurationStep[];

    private _currentData: ConfigurationStepData;

    currentStep = new js.ObservableValue<ConfigurationStep>();
    previousStep = new js.ObservableValue<ConfigurationStep>();
    nextStep = new js.ObservableValue<ConfigurationStep>();

    state = new js.ObservableValue<string>();
    
    accepted = new js.Event<any>(); /* todo: base class */
    canceled = new js.Event<any>();

    constructor(
        private schedulerExplorer: SchedulerExplorer,
        private commandService: CommandService) {

        super();
    }

    private initConfigSteps(allowedJobTypes: TypeInfo[]) {
        if (allowedJobTypes.length === 0) {
            this.state.setValue(ConfigarationState.Error);
        }

        this._currentData = {
            groupName: null,
            jobName: null,
            jobClass: null
        };

        const steps: ConfigurationStep[] = [];

        steps.push(new GroupConfigurationStep(this.schedulerExplorer));
        steps.push(new JobConfigurationStep(this.schedulerExplorer, allowedJobTypes));
        steps.push(new TriggerConfigurationStep());

        this._steps = steps;

        this.setCurrentStep(this._steps[0]);

        this.state.setValue(ConfigarationState.Ready);
    }

    initState(): void {
        this.state.setValue(ConfigarationState.Loading);

        this.commandService
            .executeCommand(new GetJobTypesCommand())
            .then(data => {
                if (data.length === 0) {
                    // todo: switch to error state
                } else {
                    this.initConfigSteps(data);
                }
            });
    }

    releaseState() {
    }

    cancel() {
        this.canceled.trigger({});
    }

    goBackOrCancel() {
        const previousStep = this.previousStep.getValue();
        if (previousStep) {
            if (previousStep.validators) {
                previousStep.validators.markPristine();
            }

            this.setCurrentStep(this.previousStep.getValue());
        } else {
            this.cancel();
        }
    }

    goNextOrSave() {
        const currentStep = this.currentStep.getValue();
        if (currentStep && currentStep.validators && !currentStep.validators.validate()) {
            return false;
        }

        if (this.nextStep.getValue()) {
            this.setCurrentStep(this.nextStep.getValue());
        } else {
            this.save();
        }

        return true;
    }

    save() {
        console.log(this._currentData);
        alert('save');
    }

    private setCurrentStep(step: ConfigurationStep) {
        const previousStep = this.currentStep.getValue();

        if (previousStep && previousStep.onLeave) {
            this._currentData = previousStep.onLeave(this._currentData);
        }

        if (step.onEnter) {
            this._currentData = step.onEnter(this._currentData);
        }

        this.currentStep.setValue(step);

        const stepIndex = this._steps.indexOf(step);

        this.previousStep.setValue(stepIndex > 0 ? this._steps[stepIndex - 1] : null);
        this.nextStep.setValue(stepIndex < this._steps.length - 1 ? this._steps[stepIndex + 1] : null);
    }
}