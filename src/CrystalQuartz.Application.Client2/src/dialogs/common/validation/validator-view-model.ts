import { Disposable, Owner } from 'john-smith/common';
import { Listenable, ObservableValue } from 'john-smith/reactive';
import { combine } from 'john-smith/reactive/transformers/combine';
import { combineAll } from 'john-smith/reactive/transformers/combine-all';
import { map } from 'john-smith/reactive/transformers/map';
import { IValidator } from './validator';

export interface IValidationAware extends Disposable {
  readonly key: unknown;
  readonly dirty: ObservableValue<boolean>;
  readonly errors: Listenable<string[]>;
  readonly failed: Listenable<boolean>;

  reset(): void;
  makeDirty(): void;
  markPristine(): void;
  hasErrors(): void;
}

export class ValidatorViewModel<T> implements IValidationAware {
  private _owner = new Owner();
  private _errors = new ObservableValue<string[]>([]);

  public readonly dirty = new ObservableValue<boolean>(false);
  public readonly errors: Listenable<string[]>;
  public readonly validated = new ObservableValue<{ data: T; errors: string[] } | null>(null);

  public readonly failed: Listenable<boolean>;
  public lastFailed: boolean = false;

  public constructor(
    forced: Listenable<boolean>,

    public readonly key: unknown,
    public readonly source: Listenable<T>,
    public readonly validators: IValidator<T>[],
    condition: Listenable<boolean> | undefined
  ) {
    const conditionErrors = condition
      ? combine(condition, this._errors, (validationAllowed: boolean, errors: string[]) =>
          validationAllowed ? errors : []
        )
      : this._errors;

    this.errors = map(
      combineAll([this.dirty, forced, conditionErrors]),
      ([isDirty, isForced, errors]) => {
        if (isForced || isDirty) {
          return errors;
        }

        return [];
      }
    );

    this.failed = map(this.errors, (errors) => errors.length > 0);

    this._owner.own(
      this.failed.listen((value) => {
        this.lastFailed = value;
      })
    );

    this._owner.own(
      source.listen((value) => {
        const actualErrors = [];
        for (let i = 0; i < validators.length; i++) {
          const errors = validators[i](value);
          if (errors) {
            for (let j = 0; j < errors.length; j++) {
              actualErrors.push(errors[j]);
            }
          }
        }

        this._errors.setValue(actualErrors);
        this.validated.setValue({ data: value, errors: this._errors.getValue() || [] });
      })
    );
  }

  public dispose(): void {
    this._owner.dispose();
  }

  public reset() {
    this._errors.setValue([]);
  }

  public makeDirty() {
    this.dirty.setValue(true);
  }

  public markPristine() {
    this.dirty.setValue(false);
  }

  public hasErrors() {
    return this.lastFailed;
  }
}
