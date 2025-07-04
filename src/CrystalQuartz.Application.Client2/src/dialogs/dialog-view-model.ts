﻿import { ObservableValue } from 'john-smith/reactive';
import { Event } from 'john-smith/reactive/event';
import { DataState } from '../global/data-state';

export interface IDialogViewModel<TResult> {
  accepted: Event<TResult>;
  canceled: Event<void>;

  cancel(): void;
}

export class DialogViewModel<TResult> implements IDialogViewModel<TResult> {
  public accepted = new Event<TResult>();
  public canceled = new Event<void>();
  public state = new ObservableValue<DataState>('unknown');
  public errorMessage = new ObservableValue<string | null>(null);

  public constructor() {
    this.state.setValue('unknown');
  }

  public cancel() {
    this.canceled.trigger();
  }

  protected goToErrorState(message: string) {
    this.state.setValue('error');
    this.errorMessage.setValue(message);
  }
}
