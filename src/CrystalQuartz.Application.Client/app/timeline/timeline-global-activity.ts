import TimelineActivity from './timeline-activity';

export interface IActivityVerticalPosition {
    top: number;
    height: number;
}

export class TimelineGlobalActivity extends TimelineActivity {
    verticalPosition = new js.ObservableValue<IActivityVerticalPosition>();

    constructor(
        key: string,
        occurredAt: number,
        public itemKey: string,
        public scope: number,
        public typeCode: string,
        public description: string) {

        super({ startedAt: occurredAt, completedAt: occurredAt, key: key });
    }

    updateVerticalPostion(top: number, height: number) {
        this.verticalPosition.setValue({
            top: top,
            height: height
        });
    }
}