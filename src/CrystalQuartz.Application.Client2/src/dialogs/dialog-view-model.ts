import { ObservableValue } from 'john-smith/reactive';
import { Event } from 'john-smith/reactive/event';
import { DataState } from '../global/data-state';

export interface IDialogViewModel<TResult> {
  accepted: Event<TResult>;
  canceled: Event<any>;

  cancel(): void;
}

export class DialogViewModel<TResult> implements IDialogViewModel<TResult> {
  accepted = new Event<any>();
  canceled = new Event<any>();
  state = new ObservableValue<DataState>('unknown');
  errorMessage = new ObservableValue<string | null>(null);

  constructor() {
    this.state.setValue('unknown');
  }

  cancel() {
    this.canceled.trigger({});
  }

  protected goToErrorState(message: string) {
    this.state.setValue('error');
    this.errorMessage.setValue(message);
  }
}
