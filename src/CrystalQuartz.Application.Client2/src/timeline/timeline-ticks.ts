import { ObservableList, ObservableValue } from 'john-smith/reactive';
import { ITimelineTickItem } from './common';

export default class TimelineTicks {
  public items = new ObservableList<ITimelineTickItem>();
  public shift = new ObservableValue<number>(0);

  public millisecondsPerTick: number;
  public tickWidthPercent: number;

  public constructor(
    private ticksCount: number,
    private timelineSizeMilliseconds: number
  ) {
    this.millisecondsPerTick = timelineSizeMilliseconds / ticksCount;
    this.tickWidthPercent = 100 / (ticksCount + 1);
  }

  public init() {
    const now =
      Math.ceil(new Date().getTime() / this.millisecondsPerTick) * this.millisecondsPerTick;
    const items = [];

    for (let i = 0; i < this.ticksCount + 1; i++) {
      const tickDate = now - this.millisecondsPerTick * (this.ticksCount - i + 1);

      items.push({
        tickDate: tickDate,
        width: this.tickWidthPercent,
      });
    }

    this.items.setValue(items);
    this.calculateShift(now);
  }

  public update(start: number, end: number) {
    const currentItems = this.items.getValue();
    if (!currentItems) {
      return;
    }

    this.removeOutdatedTicks(start, currentItems);

    if (this.items.getValue().length === 0) {
      this.init();
    } else {
      let edgeTick = this.items.getValue()[this.items.getValue().length - 1];

      while (edgeTick.tickDate + this.millisecondsPerTick / 2 < end) {
        const newTick = {
          tickDate: edgeTick.tickDate + this.millisecondsPerTick,
          width: this.tickWidthPercent,
        };

        this.items.add(newTick);

        edgeTick = newTick;
      }
    }

    this.calculateShift(new Date().getTime());
  }

  private getEdgeTick() {
    return this.items.getValue()[this.items.getValue().length - 1];
  }

  private calculateShift(endDate: number) {
    const edgeTick = this.getEdgeTick();
    const shiftMilliseconds = endDate - edgeTick.tickDate + this.millisecondsPerTick / 2;
    const shiftPercent = (100 * shiftMilliseconds) / this.timelineSizeMilliseconds;

    this.shift.setValue(shiftPercent);
  }

  private removeOutdatedTicks(startDate: number, items: ITimelineTickItem[]) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.tickDate + this.millisecondsPerTick / 2 < startDate) {
        this.items.remove(item);
      } else {
        return;
      }
    }
  }
}
