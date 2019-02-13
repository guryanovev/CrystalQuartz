import {ConfigurationStep} from './configuration-step';
import {JobDataMapItem} from '../../common/job-data-map';
import {Validators} from '../../common/validation/validators';
import {InputType} from '../../../api';
import {InputTypeVariant} from '../../../api';

import __some from 'lodash/some';
import __map from 'lodash/map';
import __each from 'lodash/each';
import __forOwn from 'lodash/forOwn';

import {MAP} from '../../../global/map';
import {ValidatorsFactory} from '../../common/validation/validators-factory';
import {Owner} from '../../../global/owner';
import {CommandService} from '../../../services';
import {GetInputTypesCommand} from '../../../commands/job-data-map-commands';

export interface TriggerStepData {
    name: string;
    triggerType: string;
    cronExpression?: string;
    repeatForever?: boolean;
    repeatCount?: number;
    repeatInterval?: number;
    jobDataMap: { key: string; value: string; inputTypeCode: string; }[];
}

export class TriggerConfigurationStep extends Owner implements ConfigurationStep {
    code = 'trigger';
    navigationLabel = '';

    triggerName = js.observableValue<string>();
    triggerType = js.observableValue<string>();
    cronExpression = js.observableValue<string>();
    repeatForever = js.observableValue<boolean>();
    repeatCount = js.observableValue<string>();
    repeatInterval = js.observableValue<string>();
    repeatIntervalType = js.observableValue<string>();

    jobDataMap = new js.ObservableList<JobDataMapItem>();

    newJobDataKey = new js.ObservableValue<string>();
    canAddJobDataKey: js.ObservableValue<boolean>;

    validators = new Validators();

    private _inputTypes: InputType[];
    private _inputTypesVariants: { [inputTypeCode: string]: InputTypeVariant[] } = {};

    constructor(
        private commandService: CommandService) {

        super();

        const isSimpleTrigger = this.own(MAP(this.triggerType, x => x === 'Simple'));

        this.validators.register(
            {
                source: this.cronExpression,
                condition: this.own(MAP(this.triggerType, x => x === 'Cron'))
            },
            ValidatorsFactory.required('Please enter cron expression'));

        this.validators.register(
            {
                source: this.repeatCount,
                condition: this.own(js.dependentValue(
                    (isSimple: boolean, repeatForever: boolean) => isSimple && !repeatForever,
                    isSimpleTrigger, this.repeatForever))
            },
            ValidatorsFactory.required('Please enter repeat count'),
            ValidatorsFactory.isInteger('Please enter an integer number'));

        this.validators.register(
            {
                source: this.repeatInterval,
                condition: isSimpleTrigger
            },
            ValidatorsFactory.required('Please enter repeat interval'),
            ValidatorsFactory.isInteger('Please enter an integer number'));

        const newJobDataKeyValidationModel = this.validators.register(
            {
                source: this.newJobDataKey
            },
            (value: string) => {
                if (value && __some(this.jobDataMap.getValue(), x => x.key === value)) {
                    return ['Key ' + value + ' has already been added'];
                }

                return null;
            });

        this.canAddJobDataKey = this.own(MAP(newJobDataKeyValidationModel.validated, x => x.data && x.data.length > 0 && x.errors.length === 0));

        this.own(this.validators);
    }

    addJobDataMapItem() {
        const payload = (inputTypes: InputType[]) => {
            const
                jobDataMapItem = new JobDataMapItem(this.newJobDataKey.getValue(), inputTypes, this._inputTypesVariants, this.commandService),
                removeWire = jobDataMapItem.onRemoved.listen(() => {
                    this.jobDataMap.remove(jobDataMapItem);
                    this.newJobDataKey.setValue(this.newJobDataKey.getValue());

                    removeWire.dispose();
                });

            this.jobDataMap.add(jobDataMapItem);
            this.newJobDataKey.setValue('');
        };

        if (this._inputTypes) {
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
            name: this.triggerName.getValue(),
            triggerType: this.triggerType.getValue(),
            jobDataMap: __map(
                this.jobDataMap.getValue(),
                x => ({
                    key: x.key,
                    value: x.getActualValue(),
                    inputTypeCode: x.inputTypeCode.getValue()
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
        __forOwn(jobDataMapErrors, (value, key) => {
            __each(this.jobDataMap.getValue(), (jobDataMapItem: JobDataMapItem) => {
                if (jobDataMapItem.key === key) {
                    jobDataMapItem.error.setValue(value);
                }
            });
        });
    }

    releaseState() {
        this.dispose();
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