import { Timer } from './timer';

export class CountdownTimer implements js.IDisposable {
    private _timer = new Timer();
    private _action: () => void;

    countdownValue = new js.ObservableValue();

    constructor(private action: () => void) {
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

    dispose() {
        this._timer.dispose();
    }

    private performAction() {
        if (this.action) {
            this.action();
        }
    }
}