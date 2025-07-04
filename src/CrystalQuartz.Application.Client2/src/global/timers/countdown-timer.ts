﻿import { Disposable } from 'john-smith/common';
import { ObservableValue } from 'john-smith/reactive';
import { Timer } from './timer';

export class CountdownTimer implements Disposable {
  private _timer = new Timer();

  public countdownValue = new ObservableValue<number | null>(null);

  public constructor(private action: () => void) {}

  public schedule(delaySeconds: number) {
    if (delaySeconds <= 0) {
      this.performAction();
    } else {
      this.countdownValue.setValue(delaySeconds);
      this._timer.schedule(() => this.schedule(delaySeconds - 1), 1000);
    }
  }

  public reset() {
    this._timer.reset();
  }

  public force() {
    this.reset();
    this.performAction();
  }

  public dispose() {
    this._timer.dispose();
  }

  private performAction() {
    if (this.action) {
      this.action();
    }
  }
}
