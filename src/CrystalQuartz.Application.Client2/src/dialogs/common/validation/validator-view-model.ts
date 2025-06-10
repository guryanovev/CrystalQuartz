import { Disposable, Owner } from 'john-smith/common';
import { Listenable, ObservableValue } from 'john-smith/reactive';
import { combine } from 'john-smith/reactive/transformers/combine';
import { combineAll } from 'john-smith/reactive/transformers/combine-all';
import { map } from 'john-smith/reactive/transformers/map';
import { IValidator } from './validator';

export class ValidatorViewModel<T> implements Disposable {
  private _owner = new Owner();
  private _errors = new ObservableValue<string[]>([]);

  dirty = new ObservableValue<boolean>(false);
  errors!: Listenable<string[]>;
  validated = new ObservableValue<{ data: T; errors: string[] } | null>(null);

  public readonly failed: Listenable<boolean>;
  public lastFailed: boolean = false;

  constructor(
    forced: Listenable<boolean>,

    public key: any,
    public source: Listenable<T>,
    public validators: IValidator<T>[],
    private condition: Listenable<boolean>
  ) {
    const conditionErrors = condition
      ? //this.own(
        combine(condition, this._errors, (validationAllowed: boolean, errors: string[]) =>
          validationAllowed ? errors : []
        )
      : // js.dependentValue(
        //     (validationAllowed: boolean, errors: string[]) => validationAllowed ? errors : [],
        //     condition,
        //     this._errors)
        //)
        this._errors;

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

    // this.own(js.dependentValue(
    //     (isDirty: boolean, isForced: boolean, errors: string[]) => {
    //         if (isForced || isDirty) {
    //             return errors;
    //         }
    //
    //         return [];
    //     },
    //     this.dirty,
    //     forced,
    //     conditionErrors));

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

  dispose(): void {
    this._owner.dispose();
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
    return this.lastFailed;
  }
}
