import { ObservableValue } from 'john-smith/reactive';
import { Event } from 'john-smith/reactive/event';
import { ApplicationViewModel } from '../application.view-model';
import { RetryTimer } from '../global/timers/retry-timer';
import { ApplicationModel } from '../application-model';
import { EnvironmentData, SchedulerData, SchedulerStatus } from '../api';
import { CommandService, ErrorInfo } from '../services';
import { INotificationService } from '../notification/notification-service';
import { DataLoader } from '../data-loader';
import { TimelineInitializer } from '../timeline/timeline-initializer';
import { GetDataCommand, GetEnvironmentDataCommand } from '../commands/global-commands';
import { combine } from 'john-smith/reactive/transformers/combine';
import DateUtils from '../utils/date';


export enum FaviconStatus {
    Loading,
    Ready,
    Active,
    Broken
}

export class StartupViewModel {
    statusMessage = new ObservableValue<string | null>(null);
    status = new ObservableValue<boolean>(false);
    dataFetched = new ObservableValue<{ environmentData: EnvironmentData, timelineInitializer: TimelineInitializer } | null>(null);
    complete = new Event<void>()
    favicon = new ObservableValue<FaviconStatus | null>(null);
    title = new ObservableValue<string>('');
    failed = new ObservableValue<boolean>(false);
    errorMessage = new ObservableValue<string | null>(null);
    retryIn = new ObservableValue<string | null>(null);
    customStylesUrl = new ObservableValue<string | null>(null);

    private _currentTimer: RetryTimer<any> | null = null;

    private _dataLoader: DataLoader;
    private _timelineInitializer: TimelineInitializer | null = null;
    private _initialData: SchedulerData | null = null;


    constructor(
        private _commandService:CommandService,
        private _applicationModel:ApplicationModel,
        private _notificationService:INotificationService) {

        this._dataLoader = new DataLoader(this._applicationModel, this._commandService);
    }

    start() {
        this.initialSetup();
        this.performLoading();
    }

    onAllMessagesDisplayed() {
        this.onAppRendered();
        this.complete.trigger();
    }

    private onAppRendered() {
        this.setupFaviconListeners();

        const offlineAndSchedulerName = combine(
            this._applicationModel.isOffline,
            this._applicationModel.schedulerName,
            (isOffline, schedulerName  ) => ({ isOffline: isOffline as boolean, schedulerName })
        );

        combine(
            this._applicationModel.inProgressCount,
            offlineAndSchedulerName,
            (left, right) => {
                const isOffline = right.isOffline;
                const schedulerName = right.schedulerName;
                const inProgressCount = left as number;

                /**
                 * Compose title here
                 */

                if (isOffline) {
                    return (schedulerName ? schedulerName + ' - ' : '') + 'Disconnected since ' + DateUtils.smartDateFormat(this._applicationModel.offlineSince!);
                }

                const suffix = inProgressCount == 0 ? '' : ` - ${inProgressCount} ${inProgressCount === 1 ? 'job' : 'jobs'} in progress`;

                return schedulerName + suffix;
            }
        ).listen(composedTitle => this.title.setValue(composedTitle));
    }

    private initialSetup() {
        this.favicon.setValue(FaviconStatus.Loading);
        this.title.setValue('Loading...');
    }

    private setupFaviconListeners() {
        this._applicationModel.isOffline.listen(isOffline => {
            if (isOffline) {
                this.favicon.setValue(FaviconStatus.Broken);
            }
        })

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
        const stepEnvironment = this.wrapWithRetry(
            () => {
                this.statusMessage.setValue('Loading environment settings');
                return this._commandService.executeCommand<EnvironmentData>(new GetEnvironmentDataCommand());
            });

        const stepData = stepEnvironment.then(
            (envData: EnvironmentData) => this.wrapWithRetry(
                () => {
                    let timelineInitializer = new TimelineInitializer(envData.TimelineSpan);
                    /**
                     * We need to initialize the timeline before first call
                     * to getData method to handle event from this call.
                     */
                    this._timelineInitializer = timelineInitializer;
                    this._timelineInitializer.start(this._commandService.onEvent);

                    if (envData.CustomCssUrl) {
                        this.statusMessage.setValue('Loading custom styles');
                        this.customStylesUrl.setValue((envData.CustomCssUrl));
                    }

                    this.statusMessage.setValue('Loading initial scheduler data');

                    return this._commandService.executeCommand<SchedulerData>(new GetDataCommand()).then(schedulerData => {
                        this.statusMessage.setValue('Done');

                        return {
                            envData: envData,
                            schedulerData: schedulerData,
                            timelineInitializer: timelineInitializer
                        };
                    });
                }
            ));

        stepData.then(data => {
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
            this.dataFetched.setValue({ environmentData: data.envData, timelineInitializer: data.timelineInitializer });

            this._applicationModel.setData(data.schedulerData);
            this.status.setValue(true);
        });
    }

    private wrapWithRetry<T>(payload: () => Promise<T>) : Promise<T> {
        const
            errorHandler = (error: ErrorInfo) => {
                this.failed.setValue(true);
                this.errorMessage.setValue(error.errorMessage);
            },

            actualPayload = (isRetry: boolean) => {
                this.failed.setValue(false);

                if (isRetry) {
                    this.statusMessage.setValue('Retry...');
                }

                return payload();
            },

            timer = new RetryTimer(actualPayload, 5, 60, errorHandler),

            disposables = [
                timer.message.listen(message => this.retryIn.setValue(message)),
                timer
            ];

        this._currentTimer = timer;

        return timer
            .start(false)
            .finally(() => {
                disposables.forEach(x => x.dispose());
            });
    }

    cancelAutoRetry() {
        if (this._currentTimer) {
            this._currentTimer.reset();
        }

        this.retryIn.setValue('canceled');
    }

    retryNow() {
        if (this._currentTimer) {
            this._currentTimer.force();
        }
    }
}
