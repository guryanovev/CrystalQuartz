import { Disposable } from 'john-smith/common';
import { ObservableValue } from 'john-smith/reactive';
import { Timer } from './timers/timer';

export class DurationFormatter {
  private static _ranges = [
    { title: 'sec', edge: 1000 },
    { title: 'min', edge: 60 },
    { title: 'hours', edge: 60 },
    { title: 'days', edge: 24 },
  ];

  static format(durationMilliseconds: number) {
    let ratio = 1;

    for (let i = 0; i < this._ranges.length; i++) {
      const rangeItem = this._ranges[i];
      ratio *= rangeItem.edge;

      const ratioUnits = durationMilliseconds / ratio;
      const isLastItem = i === this._ranges.length - 1;

      if (isLastItem || this.isCurrentRange(durationMilliseconds, i, ratio)) {
        return {
          value: Math.floor(ratioUnits).toString(),
          unit: rangeItem.title,
          ratio: ratio,
        };
      }
    }

    throw new Error('could not format provided duration'); // should not ever get here
  }

  private static isCurrentRange(
    uptimeMilliseconds: number,
    index: number,
    ratioMultiplier: number
  ) {
    return uptimeMilliseconds / (this._ranges[index + 1].edge * ratioMultiplier) < 1;
  }
}

export class Duration implements Disposable {
  value = new ObservableValue<string | null>(null);
  measurementUnit = new ObservableValue<string>('');

  private _timer = new Timer();

  constructor(
    private startDate?: number,
    private endDate?: number
  ) {
    const waitingText = '...';

    this.value.setValue(waitingText);
  }

  init() {
    this.calculate();
  }

  setStartDate(date: number | undefined) {
    this.startDate = date;
    this.calculate();
  }

  setEndDate(date: number) {
    this.endDate = date;
    this.calculate();
  }

  dispose() {
    this.releaseTimer();
  }

  private releaseTimer() {
    this._timer.reset();
  }

  private calculate() {
    this.releaseTimer();

    if (!this.startDate) {
      this.value.setValue(null);
      this.measurementUnit.setValue('');

      return;
    }

    const durationMilliseconds = (this.endDate || new Date().getTime()) - this.startDate;
    const formattedDuration = DurationFormatter.format(durationMilliseconds);

    if (formattedDuration) {
      this.value.setValue(formattedDuration.value);
      this.measurementUnit.setValue(' ' + formattedDuration.unit);

      if (!this.endDate) {
        this._timer.schedule(() => this.calculate(), formattedDuration.ratio / 2);
      }
    }
  }
}
