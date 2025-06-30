import { Disposable } from 'john-smith/common';
import { ObservableValue } from 'john-smith/reactive';
import { IValidator } from './validator';
import { ValidatorOptions } from './validator-options';
import { IValidationAware, ValidatorViewModel } from './validator-view-model';

export class Validators implements Disposable {
  private _forced = new ObservableValue<boolean>(false);

  public validators: IValidationAware[] = [];

  public register<T>(options: ValidatorOptions<T>, ...validators: IValidator<T>[]) {
    const result = new ValidatorViewModel<T>(
      this._forced,
      options.key || options.source,
      options.source,
      validators,
      options.condition
    );

    this.validators.push(result);

    return result;
  }

  public findFor(key: unknown) {
    for (let i = 0; i < this.validators.length; i++) {
      if (this.validators[i].key === key) {
        return this.validators[i];
      }
    }

    return null;
  }

  public validate() {
    this._forced.setValue(true);
    return !this.validators.some((v) => v.hasErrors());
  }

  public markPristine() {
    this._forced.setValue(false);
    this.validators.forEach((x) => x.markPristine());
  }

  public dispose() {
    this.validators.forEach((x) => x.dispose());
  }
}
