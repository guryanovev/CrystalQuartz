export interface ICommand<TOutput> {
    code: string;
    data: any;
    message: string;
    mapper?: (data: any) => TOutput;
}