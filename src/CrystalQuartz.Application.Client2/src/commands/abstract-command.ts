import { ICommand } from './contracts';

export abstract class AbstractCommand<T> implements ICommand<T> {
  public abstract code: string;
  public data: any;
  public abstract message: string;

  protected constructor() {
    this.data = {};
  }
}
