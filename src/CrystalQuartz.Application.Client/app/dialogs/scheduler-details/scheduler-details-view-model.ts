import { IDialogViewModel } from '../dialog-view-model';

export default class SchedulerDetailsViewModel implements IDialogViewModel<any> {
    accepted = new js.Event<any>();
    canceled = new js.Event<any>();

    cancel() {
        this.canceled.trigger();
    }
}