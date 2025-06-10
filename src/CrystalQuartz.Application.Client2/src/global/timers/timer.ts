import { Disposable } from 'john-smith/common';

export class Timer implements Disposable {
  private _ref: number | null = null;

  schedule(action: () => void, delay: number) {
    this.reset();
    this._ref = setTimeout(action, delay) as unknown as number;
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
