import {ConfigurationStep} from './configuration-step';
import {JobDataMapItem} from '../../common/job-data-map';
import {Validators} from '../../common/validation/validators';
import {InputType} from '../../../api';
import {InputTypeVariant} from '../../../api';

import {ValidatorsFactory} from '../../common/validation/validators-factory';
import {CommandService} from '../../../services';
import {GetInputTypesCommand} from '../../../commands/job-data-map-commands';
import { BidirectionalValue, Listenable, ObservableList, ObservableValue } from 'john-smith/reactive';
import { Owner, Disposable } from 'john-smith/common';
import { map } from 'john-smith/reactive/transformers/map';
import { combine } from 'john-smith/reactive/transformers/combine';
import { NULL_IF_EMPTY } from '../../../utils/string';

export interface TriggerStepData {
    name: string | null;
    triggerType: string;
    cronExpression?: string;
    repeatForever?: boolean;
    repeatCount?: number;
    repeatInterval?: number;
    jobDataMap: { key: string; value: string; inputTypeCode: string; }[];
}

export class TriggerConfigurationStep implements ConfigurationStep, Disposable {
    private _owner = new Owner();

    code = 'trigger';
    navigationLabel = '';

    triggerName = new BidirectionalValue<string>(_ => true, '');
    triggerType = new BidirectionalValue<string>(_ => true, 'Simple');
    cronExpression = new BidirectionalValue<string>(_ => true, '');
    repeatForever = new BidirectionalValue<boolean>(_ => true, false);
    repeatCount = new BidirectionalValue<string>(_ => true, '');
    repeatInterval = new BidirectionalValue<string>(_ => true, '');
    repeatIntervalType = new BidirectionalValue<string>(_ => true, 'Milliseconds');

    jobDataMap = new ObservableList<JobDataMapItem>();

    newJobDataKey = new BidirectionalValue<string>(_ => true, '');
    canAddJobDataKey: Listenable<boolean>;

    private _isSimpleTrigger = map(this.triggerType, x => x === 'Simple');

    validators = new Validators();
    repeatCountValidator = this.validators.register(
        {
            source: this.repeatCount,
            condition: combine(
                this._isSimpleTrigger, this.repeatForever,
                (isSimple: boolean, repeatForever: boolean) => isSimple && !repeatForever)
        },
        ValidatorsFactory.required('Please enter repeat count'),
        ValidatorsFactory.isInteger('Please enter an integer number'));
    repeatIntervalValidator = this.validators.register(
        {
            source: this.repeatInterval,
            condition: this._isSimpleTrigger
        },
        ValidatorsFactory.required('Please enter repeat interval'),
        ValidatorsFactory.isInteger('Please enter an integer number'));
    cronExpressionValidator = this.validators.register(
        {
            source: this.cronExpression,
            condition: map(this.triggerType, x => x === 'Cron')
        },
        ValidatorsFactory.required('Please enter cron expression'));

    private _inputTypes: InputType[] | null = null;
    private _inputTypesVariants: { [inputTypeCode: string]: InputTypeVariant[] } = {};

    constructor(
        private commandService: CommandService) {



        const newJobDataKeyValidationModel = this.validators.register(
            {
                source: this.newJobDataKey
            },
            (value: string) => {
                if (value && this.jobDataMap.getValue().find(x => x.key === value) !== undefined) {
                    return ['Key ' + value + ' has already been added'];
                }

                return undefined;
            });

        this.canAddJobDataKey = map(
            newJobDataKeyValidationModel.validated,
     (x: { data: string; errors: string[] } | null): boolean => {
         return (x !== null) && (!!x.data) && (x.data.length > 0) && (x.errors.length === 0);
     });

        this._owner.own(this.validators);
    }

    addJobDataMapItem() {
        const payload = (inputTypes: InputType[]) => {
            const jobDataMapItem = new JobDataMapItem(
                this.newJobDataKey.getValue(),
                inputTypes,
                this._inputTypesVariants,
                this.commandService);

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
            this.commandService
                .executeCommand(new GetInputTypesCommand())
                .then(inputTypes => {
                    this._inputTypes = inputTypes;
                    payload(this._inputTypes);
                });
        }
    }

    composeTriggerStepData(): TriggerStepData {
        const result: TriggerStepData = {
            name: NULL_IF_EMPTY(this.triggerName.getValue()),
            triggerType: this.triggerType.getValue(),
            jobDataMap:
                this.jobDataMap.getValue().map(
                    x => ({
                        key: x.key,
                        value: x.getActualValue(),
                        inputTypeCode: x.inputTypeCode.getValue()!
                    }))
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

    displayValidationErrors(jobDataMapErrors: { [key: string]: string }) {
        Object.getOwnPropertyNames(jobDataMapErrors).forEach(key => {
            const value = jobDataMapErrors[key];

            this.jobDataMap.getValue().forEach((jobDataMapItem: JobDataMapItem) => {
                if (jobDataMapItem.key === key) {
                    jobDataMapItem.error.setValue(value);
                }
            });
        })
    }

    dispose() {
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
