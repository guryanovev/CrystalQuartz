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