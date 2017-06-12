export interface IDialogViewModel<TResult> {
    accepted: js.IEvent<TResult>;
    canceled: js.IEvent<any>;
}