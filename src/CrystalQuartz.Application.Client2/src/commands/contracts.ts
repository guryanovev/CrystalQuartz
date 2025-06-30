export type CommandData = Record<string, string | boolean | number | null | undefined>;

export interface ICommand<TOutput> {
  code: string;
  data: CommandData;
  message: string;
  mapper?: (data: any) => TOutput;
}
