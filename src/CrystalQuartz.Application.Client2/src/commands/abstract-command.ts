import { CommandData, ICommand } from './contracts';

export abstract class AbstractTypedCommand<TResult, TDto> implements ICommand<TResult> {
  public abstract readonly code: string;
  public abstract readonly message: string;

  protected constructor(public readonly data: CommandData) {}

  public abstract typedMapper(dto: TDto): TResult;

  public readonly mapper = (unknownDto: unknown) => this.typedMapper(unknownDto as TDto);
}
