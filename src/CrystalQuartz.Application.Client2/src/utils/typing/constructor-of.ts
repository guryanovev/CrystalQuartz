export type ConstructorOf<T> = {
  new (...args: never[]): T;
};
