import { Disposable } from 'john-smith/common';
import { ObservableValue } from 'john-smith/reactive';
import { Event } from 'john-smith/reactive/event';
import { TypeInfo } from '../../api';
import {
  AddTriggerCommand,
  AddTriggerResult,
  GetJobTypesCommand,
  IAddTriggerForm,
} from '../../commands/trigger-commands';
import { SchedulerExplorer } from '../../scheduler-explorer';
import { CommandService } from '../../services';
import { IDialogViewModel } from '../dialog-view-model';
import { ConfigurationStep, ConfigurationStepData } from './steps/configuration-step';
import { GroupConfigurationStep } from './steps/group-configuration-step';
import { JobConfigurationStep } from './steps/job-configuration-step';
import { TriggerConfigurationStep } from './steps/trigger-configuration-step';

export interface ScheduleJobOptions {
  predefinedGroup?: string;
  predefinedJob?: string;
}

export class ConfigurationState {
  public static Loading = 'loading';
  public static Ready = 'ready';
  public static Error = 'error';
}

export class ScheduleJobViewModel implements IDialogViewModel<boolean>, Disposable {
  private _steps: ConfigurationStep[] = [];
  private _currentData!: ConfigurationStepData;
  private readonly _finalStep: TriggerConfigurationStep;

  public isSaving = new ObservableValue<boolean>(false);
  public currentStep = new ObservableValue<ConfigurationStep | null>(null);
  public previousStep = new ObservableValue<ConfigurationStep | null>(null);
  public nextStep = new ObservableValue<ConfigurationStep | null>(null);

  public state = new ObservableValue<string | null>(null);

  public accepted = new Event<boolean>();
  public canceled = new Event<void>();

  public constructor(
    private schedulerExplorer: SchedulerExplorer,
    private commandService: CommandService,
    private options: ScheduleJobOptions = {}
  ) {
    this._finalStep = new TriggerConfigurationStep(this.commandService);
  }

  private initConfigSteps(allowedJobTypes: TypeInfo[]) {
    if (allowedJobTypes.length === 0) {
      this.state.setValue(ConfigurationState.Error);
      return;
    }

    this._currentData = {
      groupName: this.options.predefinedGroup || null,
      jobName: this.options.predefinedJob || null,
      jobClass: null,
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

    this.state.setValue(ConfigurationState.Ready);
  }

  public initState(): void {
    this.state.setValue(ConfigurationState.Loading);

    this.commandService.executeCommand(new GetJobTypesCommand()).then((data) => {
      this.initConfigSteps(data);
    });
  }

  public dispose() {
    // nothing here yet
  }

  public cancel() {
    this.canceled.trigger();
  }

  public goBackOrCancel() {
    const previousStep = this.previousStep.getValue();
    if (previousStep) {
      this.setCurrentStep(this.previousStep.getValue()!);
    } else {
      this.cancel();
    }
  }

  public goNextOrSave() {
    const currentStep = this.currentStep.getValue();
    if (currentStep && currentStep.validators && !currentStep.validators.validate()) {
      return false;
    }

    const nextStep = this.nextStep.getValue();
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
      jobClass: this._currentData.jobClass!,
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
      });
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
