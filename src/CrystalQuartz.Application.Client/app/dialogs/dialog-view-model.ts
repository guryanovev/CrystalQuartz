export interface IDialogViewModel<TResult> {
    accepted: js.IEvent<TResult>;
    canceled: js.IEvent<any>;

    cancel();
}

export class DialogViewModel<TResult> implements IDialogViewModel<TResult> {
    accepted = new js.Event<any>();
    canceled = new js.Event<any>();

    cancel() {
        this.canceled.trigger({});
    }
}