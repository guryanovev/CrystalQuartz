import { CommandData, ICommand } from './contracts';

export abstract class AbstractCommand<T> implements ICommand<T> {
  public abstract code: string;
  public data: any;
  public abstract message: string;

  protected constructor() {
    this.data = {};
  }
}

export abstract class AbstractTypedCommand<TResult, TDto> implements ICommand<TResult> {
  public abstract code: string;
  public abstract message: string;

  protected constructor(public readonly data: CommandData) {}

  public abstract mapper(dto: TDto): TResult;
}
