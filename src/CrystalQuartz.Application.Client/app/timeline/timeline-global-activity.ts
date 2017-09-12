import TimelineActivity from './timeline-activity';
import { ITimelineGlobalActivityOptions } from './common';

export interface IActivityVerticalPosition {
    top: number;
    height: number;
}

export class TimelineGlobalActivity extends TimelineActivity {
    verticalPosition = new js.ObservableValue<IActivityVerticalPosition>();

    constructor(
        private globalOptions: ITimelineGlobalActivityOptions,
        requestSelectionCallback: (isSelected:boolean) => void) {

        super({ startedAt: globalOptions.occurredAt, completedAt: globalOptions.occurredAt, key: null }, requestSelectionCallback);
    }

    get typeCode() { return this.globalOptions.typeCode; }
    get description() { return this.globalOptions.description; }
    get scope() { return this.globalOptions.scope; }
    get itemKey() { return this.globalOptions.itemKey; }

    updateVerticalPostion(top: number, height: number) {
        this.verticalPosition.setValue({
            top: top,
            height: height
        });
    }
}