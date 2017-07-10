import { ApplicationModel } from '../application-model';
import { SchedulerData } from '../api';
import NumberUtils from '../utils/number';

export class MainAsideViewModel {
    uptimeValue = new js.ObservableValue<string>();
    uptimeMeasurementUnit = new js.ObservableValue<string>();
    jobsTotal = new js.ObservableValue<string>();
    jobsExecuted = new js.ObservableValue<string>();
    inProgressCount = new js.ObservableValue<number>();

    private _uptimeTimerRef: number = null;

    private _uptimeRanges = [
        { title: 'sec', edge: 1000 },
        { title: 'min', edge: 60 },
        { title: 'hours', edge: 60 },
        { title: 'days', edge: 24 }
    ];

    constructor(
        private application: ApplicationModel) {

        const waitingText = '...';

        this.uptimeValue.setValue(waitingText);
        this.jobsTotal.setValue(waitingText);
        this.jobsExecuted.setValue(waitingText);

        application.onDataChanged.listen(data => this.updateAsideData(data));
    }

    private updateAsideData(data: SchedulerData) {
        this.calculateUptime(data.RunningSince);

        this.jobsTotal.setValue(NumberUtils.formatLargeNumber(data.JobsTotal));
        this.jobsExecuted.setValue(NumberUtils.formatLargeNumber(data.JobsExecuted));
        this.inProgressCount.setValue((data.InProgress || []).length);
    }

    private calculateUptime(runningSince: number) {
        if (this._uptimeTimerRef) {
            clearTimeout(this._uptimeTimerRef);
        }

        if (!runningSince) {
            this.uptimeValue.setValue('');
            this.uptimeMeasurementUnit.setValue('none');

            return;
        }

        const uptimeMilliseconds = new Date().getTime() - runningSince;

        let ratio = 1;

        for (var i = 0; i < this._uptimeRanges.length; i++) {
            const rangeItem = this._uptimeRanges[i];
            ratio *= rangeItem.edge;

            const ratioUnits = uptimeMilliseconds / ratio,
                isLastItem = i === this._uptimeRanges.length - 1;

            if (isLastItem || this.isCurrentRange(uptimeMilliseconds, i, ratio)) {
                this.uptimeValue.setValue(Math.floor(ratioUnits).toString());
                this.uptimeMeasurementUnit.setValue(' ' + rangeItem.title);

                this._uptimeTimerRef = setTimeout(() => this.calculateUptime(runningSince), ratio / 2);

                return;
            }
        }
    }

    private isCurrentRange(uptimeMilliseconds: number, index: number, ratioMultiplier: number) {
        return (uptimeMilliseconds / (this._uptimeRanges[index + 1].edge * ratioMultiplier)) < 1;
    }
}