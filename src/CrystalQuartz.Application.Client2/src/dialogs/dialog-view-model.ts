import { ObservableValue } from 'john-smith/reactive';
import { Event } from 'john-smith/reactive/event';
import { DataState } from '../global/data-state';

export interface IDialogViewModel<TResult> {
  accepted: Event<TResult>;
  canceled: Event<any>;

  cancel(): void;
}

export class DialogViewModel<TResult> implements IDialogViewModel<TResult> {
  public accepted = new Event<any>();
  public canceled = new Event<any>();
  public state = new ObservableValue<DataState>('unknown');
  public errorMessage = new ObservableValue<string | null>(null);

  public constructor() {
    this.state.setValue('unknown');
  }

  public cancel() {
    this.canceled.trigger({});
  }

  protected goToErrorState(message: string) {
    this.state.setValue('error');
    this.errorMessage.setValue(message);
  }
}
