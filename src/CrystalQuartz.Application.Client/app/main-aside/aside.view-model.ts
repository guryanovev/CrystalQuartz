import { ApplicationModel } from '../application-model';
import { SchedulerData } from '../api';

import NumberUtils from '../utils/number';
import {Duration} from "../global/duration";

export class MainAsideViewModel {
    uptime: Duration = null;
    jobsTotal = new js.ObservableValue<string>();
    jobsExecuted = new js.ObservableValue<string>();

    inProgressCount: js.ObservableValue<number>;

    constructor(
        private application: ApplicationModel) {

        const waitingText = '...';

        this.inProgressCount = this.application.inProgressCount;
        this.uptime = new Duration();

        this.jobsTotal.setValue(waitingText);
        this.jobsExecuted.setValue(waitingText);

        application.onDataChanged.listen(data => this.updateAsideData(data));
    }

    private updateAsideData(data: SchedulerData) {
        this.uptime.setStartDate(data.RunningSince);

        this.jobsTotal.setValue(NumberUtils.formatLargeNumber(data.JobsTotal));
        this.jobsExecuted.setValue(NumberUtils.formatLargeNumber(data.JobsExecuted));
    }
}