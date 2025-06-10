import { ObservableValue } from 'john-smith/reactive';
import { ActivityInteractionRequest, ITimelineGlobalActivityOptions } from './common';
import TimelineActivity from './timeline-activity';

export interface IActivityVerticalPosition {
  top: number;
  height: number;
}

export class TimelineGlobalActivity extends TimelineActivity {
  public readonly verticalPosition = new ObservableValue<IActivityVerticalPosition | null>(null);

  public constructor(
    private globalOptions: ITimelineGlobalActivityOptions,
    requestSelectionCallback: (requestType: ActivityInteractionRequest) => void
  ) {
    super(
      { startedAt: globalOptions.occurredAt, completedAt: globalOptions.occurredAt, key: null },
      requestSelectionCallback
    );
  }

  public get typeCode() {
    return this.globalOptions.typeCode;
  }

  public get scope() {
    return this.globalOptions.scope;
  }

  public get itemKey() {
    return this.globalOptions.itemKey;
  }

  public updateVerticalPostion(top: number, height: number) {
    this.verticalPosition.setValue({
      top: top,
      height: height,
    });
  }
}
