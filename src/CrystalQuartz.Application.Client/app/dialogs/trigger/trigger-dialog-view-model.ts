import { IDialogViewModel } from '../dialog-view-model';

import { Job,  } from '../../api';
import { CommandService, CommandResult } from '../../services';
import { IAddTrackerForm, AddTriggerCommand } from '../../commands/trigger-commands';

import __some from 'lodash/some';

export class ValidatorViewModel<T> {
    private _errors = new js.ObservableValue<string[]>();

    dirty = new js.ObservableValue<boolean>();
    errors: js.IObservable<string[]>;

    constructor(
        forced: js.IObservable<boolean>,

        public key: any,
        public source: js.IObservable<T>,
        public validators: IValidator<T>[],
        private condition: js.IObservable<boolean>) {

        var conditionErrors = condition ?
            js.dependentValue(
                (validationAllowed: boolean, errors: string[]) => validationAllowed ? errors : [],
                condition,
                this._errors) :
            this._errors;

        this.errors = js.dependentValue(
            (isDirty: boolean, isForced: boolean, errors: string[]) => {
                if (isForced || isDirty) {
                    return errors;
                }

                return [];
            },
            this.dirty,
            forced,
            conditionErrors);

        source.listen(
            value => {
                var actualErrors = [];
                for (var i = 0; i < validators.length; i++) {
                    const errors = validators[i](value);
                    if (errors) {
                        for (var j = 0; j < errors.length; j++) {
                            actualErrors.push(errors[j]);
                        }
                    }
                }

                this._errors.setValue(actualErrors);
            },
            false);
    }

    reset() {
        this._errors.setValue([]);
    }

    makeDirty() {
        this.dirty.setValue(true);
    }

    hasErrors() {
        return this.errors.getValue().length > 0;
    }
}

interface ValidatorOptions<T> {
    source: js.IObservable<T>;
    key?: any;
    condition?: js.IObservable<boolean>;
}

interface IValidator<T> {
    (value: T): string[] | undefined;
}

export class Validators {
    private _forced = new js.ObservableValue<boolean>();

    public validators: ValidatorViewModel<any>[] = [];

    register<T>(
        options: ValidatorOptions<T>,
        ...validators: IValidator<T>[]) {

        this.validators.push(new ValidatorViewModel(
            this._forced,
            options.key || options.source,
            options.source,
            validators,
            options.condition));
    }

    findFor(key: any) {
        for (var i = 0; i < this.validators.length; i++) {
            if (this.validators[i].key === key) {
                return this.validators[i];
            }
        }

        return null;
    }

    validate() {
        this._forced.setValue(true);
        return !__some(this.validators, v => v.hasErrors());
    }
}

function map<T, U>(source: js.IObservable<T>, func: (value: T) => U) {
    return js.dependentValue(func, source);
}

class ValidatorsFactory {
    static required<T>(message: string) {
        return (value: T) => {
            if (!value) {
                return [message];
            }

            return [];
        }
    }

    static isInteger<T>(message: string) {
        return (value: T) => {
            if (value === null || value === undefined) {
                return [];
            }

            const rawValue = value.toString();

            for (var i = 0; i < rawValue.length; i++) {
                const char = rawValue.charAt(i);
                if (char < '0' || char > '9') {
                    return [message];
                }
            }

            return [];
        }
    }
}

export default class TriggerDialogViewModel {
    accepted = new js.Event<any>(); /* todo: base class */
    canceled = new js.Event<any>();

    triggerName = js.observableValue<string>();
    triggerType = js.observableValue<string>();
    cronExpression = js.observableValue<string>();
    repeatForever = js.observableValue<boolean>();
    repeatCount = js.observableValue<string>();
    repeatInterval = js.observableValue<string>();
    repeatIntervalType = js.observableValue<string>();

    isSaving = js.observableValue<boolean>();

    validators = new Validators();

    constructor(
        private job: Job,
        private commandService: CommandService) {

        const isSimpleTrigger = map(this.triggerType, x => x === 'Simple');

        this.validators.register(
            {
                source: this.cronExpression,
                condition: map(this.triggerType, x => x === 'Cron')
            },
            ValidatorsFactory.required('Please enter cron expression'));

        this.validators.register(
            {
                source: this.repeatCount,
                condition: js.dependentValue(
                    (isSimple: boolean, repeatForever: boolean) => isSimple && !repeatForever,
                    isSimpleTrigger, this.repeatForever)
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
    }

    cancel() {
        this.canceled.trigger();
    }

    save() {
        if (!this.validators.validate()) {
            return false;
        }

        var form: IAddTrackerForm = {
            name: this.triggerName.getValue(),
            job: this.job.Name,
            group: this.job.GroupName,
            triggerType: this.triggerType.getValue()
        };

        if (this.triggerType.getValue() === 'Simple') {
            var repeatForever = this.repeatForever.getValue();

            form.repeatForever = repeatForever;

            if (!repeatForever) {
                form.repeatCount = +this.repeatCount.getValue();
            }

            var repeatInterval = +this.repeatInterval.getValue();

            form.repeatInterval = repeatInterval * this.getIntervalMultiplier();

        } else if (this.triggerType.getValue() === 'Cron') {
            form.cronExpression = this.cronExpression.getValue();
        }

        this.isSaving.setValue(true);
        this.commandService
            .executeCommand(new AddTriggerCommand(form))
            .then((result: CommandResult) => {
                if (result.Success) {
                    this.accepted.trigger(true);
                }
            })
            .always(() => {
                this.isSaving.setValue(false);
            })
            .fail((reason) => {
                console.log(reason); /* todo */
            });

        return true;
    }

    private getIntervalMultiplier() {
        var intervalCode = this.repeatIntervalType.getValue();

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