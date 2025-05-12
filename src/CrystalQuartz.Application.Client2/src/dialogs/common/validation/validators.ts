import { ValidatorViewModel } from './validator-view-model';
import { IValidator } from './validator';
import { ValidatorOptions } from './validator-options';
import { Disposable } from 'john-smith/common';
import { ObservableValue } from 'john-smith/reactive';

export class Validators implements Disposable {
    private _forced = new ObservableValue<boolean>(false);

    public validators: ValidatorViewModel<any>[] = [];

    register<T>(
        options: ValidatorOptions<T>,
        ...validators: IValidator<T>[]) {

        const result = new ValidatorViewModel<T>(
            this._forced,
            options.key || options.source,
            options.source,
            validators,
            options.condition!);

        this.validators.push(result);

        return result;
    }

    findFor(key: any) {
        for (let i = 0; i < this.validators.length; i++) {
            if (this.validators[i].key === key) {
                return this.validators[i];
            }
        }

        return null;
    }

    validate() {
        this._forced.setValue(true);
        return !this.validators.some(v => v.hasErrors());
    }

    markPristine() {
        this._forced.setValue(false);
        this.validators.forEach(x => x.markPristine());
    }

    dispose() {
        this.validators.forEach(x => x.dispose());
    }
}
