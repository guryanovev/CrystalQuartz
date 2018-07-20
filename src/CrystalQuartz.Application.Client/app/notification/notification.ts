export default class Notification {
    outdated = new js.Event<any>();

    private _timerRef: number = null;

    constructor(
        public content: string) {
        
        this.scheduleClosing();
    }

    forceClosing() {
        this.clearTimer();
        this.close();
    }

    disableClosing() {
        this.clearTimer();
    }

    enableClosing() {
        this.scheduleClosing();
    }

    private scheduleClosing() {
        this._timerRef = setTimeout(() => {
            this.outdated.trigger(null);
            this.close();
        }, 7000);
    }

    private close() {
        this.outdated.trigger(null);
    }

    private clearTimer() {
        if (this._timerRef) {
            clearTimeout(this._timerRef);
            this._timerRef = null;
        }
    }
}