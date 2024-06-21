import TimelineActivity from './timeline-activity';
import { ITimelineGlobalActivityOptions, ActivityInteractionRequest } from './common';
import { ObservableValue } from 'john-smith/reactive';

export interface IActivityVerticalPosition {
    top: number;
    height: number;
}

export class TimelineGlobalActivity extends TimelineActivity {
    verticalPosition = new ObservableValue<IActivityVerticalPosition | null>(null);

    constructor(
        private globalOptions: ITimelineGlobalActivityOptions,
        requestSelectionCallback: (requestType: ActivityInteractionRequest) => void) {

        super({ startedAt: globalOptions.occurredAt, completedAt: globalOptions.occurredAt, key: null }, requestSelectionCallback);
    }

    get typeCode() { return this.globalOptions.typeCode; }
    get scope() { return this.globalOptions.scope; }
    get itemKey() { return this.globalOptions.itemKey; }

    updateVerticalPostion(top: number, height: number) {
        this.verticalPosition.setValue({
            top: top,
            height: height
        });
    }
}
