export interface ValidatorOptions<T> {
    source: js.IObservable<T>;
    key?: any;
    condition?: js.IObservable<boolean>;
}