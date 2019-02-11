import { Owner } from '../../../global/owner';
import { IValidator } from './validator';

export class ValidatorViewModel<T> extends Owner {
    private _errors = new js.ObservableValue<string[]>();

    dirty = new js.ObservableValue<boolean>();
    errors: js.IObservable<string[]>;
    validated = new js.ObservableValue<{ data: T, errors: string[] }>();

    constructor(
        forced: js.IObservable<boolean>,

        public key: any,
        public source: js.IObservable<T>,
        public validators: IValidator<T>[],
        private condition: js.IObservable<boolean>) {

        super();

        var conditionErrors = condition ?
            this.own(
                js.dependentValue(
                    (validationAllowed: boolean, errors: string[]) => validationAllowed ? errors : [],
                    condition,
                    this._errors)) :
            this._errors;

        this.errors = this.own(js.dependentValue(
            (isDirty: boolean, isForced: boolean, errors: string[]) => {
                if (isForced || isDirty) {
                    return errors;
                }

                return [];
            },
            this.dirty,
            forced,
            conditionErrors));

        this.own(source.listen(
            (value, oldValue, data) => {
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
                this.validated.setValue({ data: value, errors: this._errors.getValue() || [] });
            }));
    }

    reset() {
        this._errors.setValue([]);
    }

    makeDirty() {
        this.dirty.setValue(true);
    }

    markPristine() {
        this.dirty.setValue(false);
    }

    hasErrors() {
        const errors = this.errors.getValue();
        return errors && errors.length > 0;
    }
}