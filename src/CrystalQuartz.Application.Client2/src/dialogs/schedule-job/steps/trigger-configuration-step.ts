import { Disposable, Owner } from 'john-smith/common';
import {
  BidirectionalValue,
  Listenable,
  ObservableList,
  ObservableValue,
} from 'john-smith/reactive';
import { combine } from 'john-smith/reactive/transformers/combine';
import { map } from 'john-smith/reactive/transformers/map';
import { InputType, InputTypeVariant } from '../../../api';
import { GetInputTypesCommand } from '../../../commands/job-data-map-commands';
import { CommandService } from '../../../services';
import { NULL_IF_EMPTY } from '../../../utils/string';
import { JobDataMapItem } from '../../common/job-data-map';
import { Validators } from '../../common/validation/validators';
import { ValidatorsFactory } from '../../common/validation/validators-factory';
import { ConfigurationStep } from './configuration-step';

export interface TriggerStepData {
  name: string | null;
  triggerType: string;
  cronExpression?: string;
  repeatForever?: boolean;
  repeatCount?: number;
  repeatInterval?: number;
  jobDataMap: { key: string; value: string; inputTypeCode: string }[];
}

export class TriggerConfigurationStep implements ConfigurationStep, Disposable {
  private _owner = new Owner();

  public code = 'trigger';
  public navigationLabel = '';

  public triggerName = new BidirectionalValue<string>((_) => true, '');
  public triggerType = new BidirectionalValue<string>((_) => true, 'Simple');
  public cronExpression = new BidirectionalValue<string>((_) => true, '');
  public repeatForever = new BidirectionalValue<boolean>((_) => true, false);
  public repeatCount = new BidirectionalValue<string>((_) => true, '');
  public repeatInterval = new BidirectionalValue<string>((_) => true, '');
  public repeatIntervalType = new BidirectionalValue<string>((_) => true, 'Milliseconds');

  public jobDataMap = new ObservableList<JobDataMapItem>();

  public newJobDataKey = new BidirectionalValue<string>((_) => true, '');
  public canAddJobDataKey: Listenable<boolean>;

  private _isSimpleTrigger = map(this.triggerType, (x) => x === 'Simple');

  public validators = new Validators();
  public repeatCountValidator = this.validators.register(
    {
      source: this.repeatCount,
      condition: combine(
        this._isSimpleTrigger,
        this.repeatForever,
        (isSimple: boolean, repeatForever: boolean) => isSimple && !repeatForever
      ),
    },
    ValidatorsFactory.required('Please enter repeat count'),
    ValidatorsFactory.isInteger('Please enter an integer number')
  );
  public repeatIntervalValidator = this.validators.register(
    {
      source: this.repeatInterval,
      condition: this._isSimpleTrigger,
    },
    ValidatorsFactory.required('Please enter repeat interval'),
    ValidatorsFactory.isInteger('Please enter an integer number')
  );
  public cronExpressionValidator = this.validators.register(
    {
      source: this.cronExpression,
      condition: map(this.triggerType, (x) => x === 'Cron'),
    },
    ValidatorsFactory.required('Please enter cron expression')
  );

  private _inputTypes: InputType[] | null = null;
  private _inputTypesVariants: { [inputTypeCode: string]: InputTypeVariant[] } = {};

  public constructor(private commandService: CommandService) {
    const newJobDataKeyValidationModel = this.validators.register(
      {
        source: this.newJobDataKey,
      },
      (value: string) => {
        if (value && this.jobDataMap.getValue().find((x) => x.key === value) !== undefined) {
          return ['Key ' + value + ' has already been added'];
        }

        return undefined;
      }
    );

    this.canAddJobDataKey = map(
      newJobDataKeyValidationModel.validated,
      (x: { data: string; errors: string[] } | null): boolean => {
        return x !== null && !!x.data && x.data.length > 0 && x.errors.length === 0;
      }
    );

    this._owner.own(this.validators);
  }

  public addJobDataMapItem() {
    const payload = (inputTypes: InputType[]) => {
      const jobDataMapItem = new JobDataMapItem(
        this.newJobDataKey.getValue(),
        inputTypes,
        this._inputTypesVariants,
        this.commandService
      );

      const removeWire = jobDataMapItem.onRemoved.listen(() => {
        this.jobDataMap.remove(jobDataMapItem);
        this.newJobDataKey.setValue(this.newJobDataKey.getValue());

        removeWire.dispose();
      });

      this.jobDataMap.add(jobDataMapItem);
      this.newJobDataKey.setValue('');
    };

    if (this._inputTypes !== null) {
      payload(this._inputTypes);
    } else {
      this.commandService.executeCommand(new GetInputTypesCommand()).then((inputTypes) => {
        this._inputTypes = inputTypes;
        payload(this._inputTypes);
      });
    }
  }

  public composeTriggerStepData(): TriggerStepData {
    const result: TriggerStepData = {
      name: NULL_IF_EMPTY(this.triggerName.getValue()),
      triggerType: this.triggerType.getValue(),
      jobDataMap: this.jobDataMap.getValue().map((x) => ({
        key: x.key,
        value: x.getActualValue(),
        inputTypeCode: x.inputTypeCode.getValue()!,
      })),
    };

    if (this.triggerType.getValue() === 'Simple') {
      const repeatForever = this.repeatForever.getValue();

      result.repeatForever = repeatForever;

      if (!repeatForever) {
        result.repeatCount = +this.repeatCount.getValue();
      }

      const repeatInterval = +this.repeatInterval.getValue();

      result.repeatInterval = repeatInterval * this.getIntervalMultiplier();
    } else if (this.triggerType.getValue() === 'Cron') {
      result.cronExpression = this.cronExpression.getValue();
    }

    return result;
  }

  public displayValidationErrors(jobDataMapErrors: { [key: string]: string }) {
    Object.getOwnPropertyNames(jobDataMapErrors).forEach((key) => {
      const value = jobDataMapErrors[key];

      this.jobDataMap.getValue().forEach((jobDataMapItem: JobDataMapItem) => {
        if (jobDataMapItem.key === key) {
          jobDataMapItem.error.setValue(value);
        }
      });
    });
  }

  public dispose() {
    this._owner.dispose();
  }

  private getIntervalMultiplier() {
    const intervalCode = this.repeatIntervalType.getValue();

    if (intervalCode === 'Seconds') {
      return 1000;
    }

    if (intervalCode === 'Minutes') {
      return 1000 * 60;
    }

    if (intervalCode === 'Hours') {
      return 1000 * 60 * 60;
    }

    if (intervalCode === 'Days') {
      return 1000 * 60 * 60 * 24;
    }

    return 1;
  }
}
