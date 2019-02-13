export const MAP = function<T, U>(source: js.IObservable<T>, func: (value: T) => U) {
    return js.dependentValue(func, source);
};