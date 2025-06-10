import { Disposable } from 'john-smith/common';
import { ObservableValue } from 'john-smith/reactive';
import { DurationFormatter } from '../duration';
import { CountdownTimer } from './countdown-timer';

export class RetryTimer<TResult> implements Disposable {
  timer: CountdownTimer;
  message = new ObservableValue<string>('');
  isInProgress = new ObservableValue<boolean>(false);

  private _currentRetryInterval: number = 0;
  private _messageWire: Disposable;
  private _isRetry = false;
  private _currentResult: {
    resolve: (value: PromiseLike<TResult> | TResult) => void;
    reject: (reason?: any) => void;
  } | null = null;

  constructor(
    private payload: (isRetry: boolean) => Promise<TResult>,
    private minInterval: number = 5,
    private maxInterval: number = 60,
    private onFailed?: (error: any) => void
  ) {
    this.timer = new CountdownTimer(() => this.performRetry());
    this._messageWire = this.timer.countdownValue.listen((countdownValue: number | null) => {
      if (countdownValue) {
        const formattedDuration = DurationFormatter.format(countdownValue * 1000);
        this.message.setValue(`in ${formattedDuration.value} ${formattedDuration.unit}`);
      }
    });
  }

  start(sleepBeforeFirstCall: boolean): Promise<TResult> {
    this.timer.reset();
    this._currentRetryInterval = this.minInterval;

    const result = new Promise<TResult>((resolve, reject) => {
      this._currentResult = { resolve: resolve, reject: reject };
    });

    if (sleepBeforeFirstCall) {
      this.scheduleRetry();
    } else {
      this.performRetry();
    }

    return result;
  }

  force() {
    this.timer.reset();
    this.performRetry();
  }

  reset() {
    this.timer.reset();
  }

  dispose() {
    this.timer.dispose();
    this._messageWire.dispose();
  }

  private performRetry() {
    const payloadPromise = this.payload(this._isRetry);

    this.isInProgress.setValue(true);
    this.message.setValue('in progress...');

    // this timeout is for UI only
    setTimeout(() => {
      payloadPromise
        .then((response) => {
          this._currentResult?.resolve(response);
        })
        .catch((error) => {
          this._isRetry = true;
          if (this.onFailed) {
            this.onFailed(error);
          }

          this.scheduleRetry();
        })
        .finally(() => {
          this.isInProgress.setValue(false);
        });
    }, 10);
  }

  private scheduleRetry() {
    this.timer.schedule(this._currentRetryInterval);
    this._currentRetryInterval = Math.min(this._currentRetryInterval * 2, this.maxInterval);
  }
}
