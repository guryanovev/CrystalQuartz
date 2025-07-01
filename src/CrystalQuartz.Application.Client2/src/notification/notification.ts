import { Event } from 'john-smith/reactive/event';

export default class Notification {
  private _timerRef: ReturnType<typeof setTimeout> | null = null;

  public readonly outdated = new Event<void>();

  public constructor(public content: string) {
    this.scheduleClosing();
  }

  public forceClosing() {
    this.clearTimer();
    this.close();
  }

  public disableClosing() {
    this.clearTimer();
  }

  public enableClosing() {
    this.scheduleClosing();
  }

  private scheduleClosing() {
    this._timerRef = setTimeout(() => {
      this.outdated.trigger();
      this.close();
    }, 7000);
  }

  private close() {
    this.outdated.trigger();
  }

  private clearTimer() {
    if (this._timerRef) {
      clearTimeout(this._timerRef);
      this._timerRef = null;
    }
  }
}
