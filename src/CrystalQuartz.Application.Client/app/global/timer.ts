import {DurationFormatter} from "./duration";

export class Timer implements js.IDisposable {
    private _ref: number;

    schedule(action: () => void, delay: number) {
        this.reset();
        this._ref = setTimeout(action, delay);
    }

    reset() {
        if (this._ref) {
            clearTimeout(this._ref);
            this._ref = null;
        }
    }

    dispose() {
        this.reset();
    }
}

export class CountdownTimer implements js.IDisposable {
    private _timer = new Timer();
    private _action: () => void;

    countdownValue = new js.ObservableValue();

    constructor(private action: () => void){
    }

    schedule(delaySeconds: number) {
        if (delaySeconds <= 0) {
            this.performAction();
        } else {
            this.countdownValue.setValue(delaySeconds);
            this._timer.schedule(() => this.schedule(delaySeconds - 1), 1000);
        }
    }

    reset() {
        this._timer.reset();
    }

    force() {
        this.reset();
        this.performAction();
    }

    dispose(){
        this._timer.dispose();
    }

    private performAction(){
        if (this.action) {
            this.action();
        }
    }
}

export class RetryTimer<TResult> implements js.IDisposable {
    timer: CountdownTimer;
    message = new js.ObservableValue<string>();
    isInProgress = new js.ObservableValue<boolean>();

    private _currentRetryInterval: number;
    private _messageWire: js.IDisposable;
    private _isRetry = false;
    private _currentResult: JQueryDeferred<TResult>;

    constructor(
        private payload: (isRetry: boolean) => JQueryPromise<TResult>,
        private minInterval: number = 5,
        private maxInterval: number = 60,
        private onFailed: (error: any) => void = null) {

        this.timer = new CountdownTimer(() => this.performRetry());
        this._messageWire = this.timer.countdownValue.listen((countdownValue: number) => {
            if (countdownValue) {
                let formattedDuration = DurationFormatter.format(countdownValue * 1000);
                this.message.setValue(`in ${formattedDuration.value} ${formattedDuration.unit}`);
            }
        });
    }

    start(sleepBeforeFirstCall: boolean) : JQueryPromise<TResult> {
        this.timer.reset();
        this._currentRetryInterval = this.minInterval;

        const result = $.Deferred();

        this._currentResult = result;

        if (sleepBeforeFirstCall) {
            this.scheduleRetry();
        } else {
            this.performRetry();
        }

        return result.promise();
    }

    force() {
        this.timer.reset();
        this.performRetry();
    }

    reset() {
        this.timer.reset();
    }

    dispose(){
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
                .done(response => {
                    this._currentResult.resolve(response);
                })
                .fail(error => {
                    this._isRetry = true;
                    if (this.onFailed) {
                        this.onFailed(error);
                    }

                    this.scheduleRetry();
                })
                .always(() => {
                    this.isInProgress.setValue(false);
                });
        }, 10);
    }

    private scheduleRetry() {
        this.timer.schedule(this._currentRetryInterval);
        this._currentRetryInterval = Math.min(this._currentRetryInterval * 2, this.maxInterval);
    }
}