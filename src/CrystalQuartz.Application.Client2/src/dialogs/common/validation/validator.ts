export interface IValidator<T> {
  (value: T): string[] | undefined;
}
