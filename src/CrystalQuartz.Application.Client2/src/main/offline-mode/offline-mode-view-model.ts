import { ObservableValue } from 'john-smith/reactive';
import { SchedulerData } from '../../api';
import { ApplicationModel } from '../../application-model';
import { GetDataCommand } from '../../commands/global-commands';
import { RetryTimer } from '../../global/timers/retry-timer';
import { CommandService } from '../../services';
import DateUtils from '../../utils/date';

export class OfflineModeViewModel {
  private _retryTimer = new RetryTimer(() => this.recover(), 10, 60 * 3);

  retryIn = this._retryTimer.message;
  isInProgress = this._retryTimer.isInProgress;
  serverUrl: string;
  since = new ObservableValue<string>('');

  constructor(
    private initialSince: number,
    private commandService: CommandService,
    private application: ApplicationModel
  ) {
    this.serverUrl = window.location.href;
  }

  init() {
    this.setFormattedSince();
    this._retryTimer.start(true).then((data) => this.handleRecoveredData(data));
  }

  dispose() {
    this._retryTimer.dispose();
  }

  retryNow() {
    this._retryTimer.force();
  }

  private recover() {
    this.setFormattedSince();
    return this.commandService.executeCommand(new GetDataCommand());
    /*.then(() => {
                throw new Error('temp error');
            })*/
  }

  private handleRecoveredData(data: SchedulerData) {
    this.application.setData(data);
    this.application.goOnline();
  }

  private setFormattedSince() {
    this.since.setValue(DateUtils.smartDateFormat(this.initialSince));
  }
}
