import { ObservableValue } from 'john-smith/reactive';
import { Event } from 'john-smith/reactive/event';
import { combine } from 'john-smith/reactive/transformers/combine';
import { EnvironmentData, SchedulerData, SchedulerStatus } from '../api';
import { ApplicationModel } from '../application-model';
import { GetDataCommand, GetEnvironmentDataCommand } from '../commands/global-commands';
import { DataLoader } from '../data-loader';
import { IManagedRetry, RetryTimer } from '../global/timers/retry-timer';
import { INotificationService } from '../notification/notification-service';
import { CommandService, ErrorInfo } from '../services';
import { TimelineInitializer } from '../timeline/timeline-initializer';
import DateUtils from '../utils/date';

export enum FaviconStatus {
  Loading,
  Ready,
  Active,
  Broken,
}

export class StartupViewModel {
  public readonly statusMessage = new ObservableValue<string | null>(null);
  public readonly status = new ObservableValue<boolean>(false);
  public readonly dataFetched = new ObservableValue<{
    environmentData: EnvironmentData;
    timelineInitializer: TimelineInitializer;
  } | null>(null);
  public readonly complete = new Event<void>();
  public readonly favicon = new ObservableValue<FaviconStatus | null>(null);
  public readonly title = new ObservableValue<string>('');
  public readonly failed = new ObservableValue<boolean>(false);
  public readonly errorMessage = new ObservableValue<string | null>(null);
  public readonly retryIn = new ObservableValue<string | null>(null);
  public readonly customStylesUrl = new ObservableValue<string | null>(null);

  private _currentTimer: IManagedRetry | null = null;

  private _dataLoader: DataLoader;
  private _timelineInitializer: TimelineInitializer | null = null;
  private _initialData: SchedulerData | null = null;

  public constructor(
    private _commandService: CommandService,
    private _applicationModel: ApplicationModel,
    private _notificationService: INotificationService
  ) {
    this._dataLoader = new DataLoader(this._applicationModel, this._commandService);
  }

  public start() {
    this.initialSetup();
    this.performLoading();
  }

  public onAllMessagesDisplayed() {
    this.onAppRendered();
    this.complete.trigger();
  }

  private onAppRendered() {
    this.setupFaviconListeners();

    const offlineAndSchedulerName = combine(
      this._applicationModel.isOffline,
      this._applicationModel.schedulerName,
      (isOffline, schedulerName) => ({ isOffline: isOffline as boolean, schedulerName })
    );

    combine(this._applicationModel.inProgressCount, offlineAndSchedulerName, (left, right) => {
      const isOffline = right.isOffline;
      const schedulerName = right.schedulerName;
      const inProgressCount = left as number;

      /**
       * Compose title here
       */

      if (isOffline) {
        return (
          (schedulerName ? schedulerName + ' - ' : '') +
          'Disconnected since ' +
          DateUtils.smartDateFormat(this._applicationModel.offlineSince!)
        );
      }

      const suffix =
        inProgressCount == 0
          ? ''
          : ` - ${inProgressCount} ${inProgressCount === 1 ? 'job' : 'jobs'} in progress`;

      return schedulerName + suffix;
    }).listen((composedTitle) => this.title.setValue(composedTitle));
  }

  private initialSetup() {
    this.favicon.setValue(FaviconStatus.Loading);
    this.title.setValue('Loading...');
  }

  private setupFaviconListeners() {
    this._applicationModel.isOffline.listen((isOffline) => {
      if (isOffline) {
        this.favicon.setValue(FaviconStatus.Broken);
      }
    });

    const syncFaviconWithSchedulerData = (data: SchedulerData | null) => {
      if (data) {
        const schedulerStatus = SchedulerStatus.findByCode(data.Status);

        if (schedulerStatus === SchedulerStatus.Started) {
          this.favicon.setValue(FaviconStatus.Active);
        } else {
          this.favicon.setValue(FaviconStatus.Ready);
        }
      }
    };

    this._applicationModel.onDataChanged.listen(syncFaviconWithSchedulerData);
    syncFaviconWithSchedulerData(this._initialData);
  }

  private performLoading() {
    const stepEnvironment = this.wrapWithRetry(() => {
      this.statusMessage.setValue('Loading environment settings');
      return this._commandService.executeCommand<EnvironmentData>(new GetEnvironmentDataCommand());
    });

    const stepData = stepEnvironment.then((envData: EnvironmentData) =>
      this.wrapWithRetry(() => {
        const timelineInitializer = new TimelineInitializer(envData.TimelineSpan);
        /**
         * We need to initialize the timeline before first call
         * to getData method to handle event from this call.
         */
        this._timelineInitializer = timelineInitializer;
        this._timelineInitializer.start(this._commandService.onEvent);

        if (envData.CustomCssUrl) {
          this.statusMessage.setValue('Loading custom styles');
          this.customStylesUrl.setValue(envData.CustomCssUrl);
        }

        this.statusMessage.setValue('Loading initial scheduler data');

        return this._commandService
          .executeCommand<SchedulerData>(new GetDataCommand())
          .then((schedulerData) => {
            this.statusMessage.setValue('Done');

            return {
              envData: envData,
              schedulerData: schedulerData,
              timelineInitializer: timelineInitializer,
            };
          });
      })
    );

    stepData.then((data) => {
      // this.applicationViewModel = new ApplicationViewModel(
      //     this._applicationModel,
      //     this._commandService,
      //     data.envData,
      //     this._notificationService,
      //     this._timelineInitializer);

      this._initialData = data.schedulerData;

      /**
       * That would trigger application services.
       */
      this.dataFetched.setValue({
        environmentData: data.envData,
        timelineInitializer: data.timelineInitializer,
      });

      this._applicationModel.setData(data.schedulerData);
      this.status.setValue(true);
    });
  }

  private wrapWithRetry<T>(payload: () => Promise<T>): Promise<T> {
    const errorHandler = (error: ErrorInfo) => {
      this.failed.setValue(true);
      this.errorMessage.setValue(error.errorMessage);
    };

    const actualPayload = () => {
      this.failed.setValue(false);
      return payload();
    };

    const timer = new RetryTimer(actualPayload, 5, 60, errorHandler);
    const disposables = [timer.message.listen((message) => this.retryIn.setValue(message)), timer];

    this._currentTimer = timer;

    return timer.start(false).finally(() => {
      disposables.forEach((x) => x.dispose());
    });
  }

  public cancelAutoRetry() {
    if (this._currentTimer) {
      this._currentTimer.reset();
    }

    this.retryIn.setValue('canceled');
  }

  public retryNow() {
    if (this._currentTimer) {
      this._currentTimer.force();
    }
  }
}
