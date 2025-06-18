import { ObservableValue } from 'john-smith/reactive';
import { SchedulerData } from '../../api';
import { ApplicationModel } from '../../application-model';
import { Duration } from '../../global/duration';
import NumberUtils from '../../utils/number';

export class MainAsideViewModel {
  public readonly uptime: Duration = new Duration();
  public readonly jobsTotal = new ObservableValue<string | null>(null);
  public readonly jobsExecuted = new ObservableValue<string | null>(null);

  public readonly inProgressCount: ObservableValue<number>;

  public constructor(private application: ApplicationModel) {
    const waitingText = '...';

    this.inProgressCount = this.application.inProgressCount;

    this.jobsTotal.setValue(waitingText);
    this.jobsExecuted.setValue(waitingText);

    application.onDataChanged.listen((data) => this.updateAsideData(data));
  }

  private updateAsideData(data: SchedulerData) {
    this.uptime.setStartDate(data.RunningSince ?? undefined);

    this.jobsTotal.setValue(NumberUtils.formatLargeNumber(data.JobsTotal));
    this.jobsExecuted.setValue(NumberUtils.formatLargeNumber(data.JobsExecuted));
  }
}
