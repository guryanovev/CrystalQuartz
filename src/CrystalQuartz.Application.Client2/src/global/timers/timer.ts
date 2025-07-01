import { Disposable } from 'john-smith/common';

export class Timer implements Disposable {
  private _ref: number | null = null;

  public schedule(action: () => void, delay: number) {
    this.reset();
    this._ref = setTimeout(action, delay) as unknown as number;
  }

  public reset() {
    if (this._ref) {
      clearTimeout(this._ref);
      this._ref = null;
    }
  }

  public dispose() {
    this.reset();
  }
}
