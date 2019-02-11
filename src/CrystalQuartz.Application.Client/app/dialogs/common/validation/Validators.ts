import { ValidatorViewModel } from './validator-view-model';
import { IValidator } from './validator';
import { ValidatorOptions } from './validator-options';

import __some from 'lodash/some';
import __each from 'lodash/each';

export class Validators implements js.IDisposable {
    private _forced = new js.ObservableValue<boolean>();

    public validators: ValidatorViewModel<any>[] = [];

    register<T>(
        options: ValidatorOptions<T>,
        ...validators: IValidator<T>[]) {

        const result = new ValidatorViewModel<T>(
            this._forced,
            options.key || options.source,
            options.source,
            validators,
            options.condition);

        this.validators.push(result);

        return result;
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

    markPristine() {
        this._forced.setValue(false);
        __each(this.validators, x => x.markPristine());
    }

    dispose() {
        __each(this.validators, x => x.dispose());
    }
}