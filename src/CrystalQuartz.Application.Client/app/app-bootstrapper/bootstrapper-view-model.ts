import { CommandService, ErrorInfo } from '../services';
import { GetEnvironmentDataCommand, GetDataCommand } from '../commands/global-commands';
import {SchedulerData, EnvironmentData, SchedulerStatus} from '../api';
import { ApplicationModel } from '../application-model';
import { DataLoader } from '../data-loader';
import ApplicationViewModel from '../application-view-model';

import { DefaultNotificationService } from '../notification/notification-service';
import { RetryTimer } from "../global/timers/retry-timer";

import __each from 'lodash/each';
import {TimelineInitializer} from "../timeline/timeline-initializer";
import DateUtils from "../utils/date";

export enum FaviconStatus {
    Loading,
    Ready,
    Active,
    Broken
}

export default class BootstrapperViewModel {
    statusMessage = new js.ObservableValue<string>();
    status = new js.ObservableValue<boolean>();
    favicon = new js.ObservableValue<FaviconStatus>();
    title = new js.ObservableValue<string>();
    failed = new js.ObservableValue<boolean>();
    errorMessage = new js.ObservableValue<string>();
    retryIn = new js.ObservableValue<string>();
    customStylesUrl = new js.ObservableValue<string>();

    applicationViewModel: ApplicationViewModel;

    private _currentTimer: RetryTimer<any>;

    private _commandService:CommandService;
    private _applicationModel:ApplicationModel;
    private _notificationService:DefaultNotificationService;
    private _dataLoader: DataLoader;
    private _timelineInitializer: TimelineInitializer;
    private _initialData: SchedulerData;

    start() {
        this._commandService = new CommandService(),
        this._applicationModel = new ApplicationModel(),
        this._notificationService = new DefaultNotificationService(),
        this._dataLoader = new DataLoader(this._applicationModel, this._commandService);

        this.initialSetup();
        this.performLoading();
    }

    onAppRendered() {
        this.setupFaviconListeners();

        js.dependentValue(
            (isOffline: boolean, schedulerName: string, inProgressCount: number) => {
                /**
                 * Compose title here
                 */

                if (isOffline) {
                    return (schedulerName ? schedulerName + ' - ' : '') + 'Disconnected since ' + DateUtils.smartDateFormat(this._applicationModel.offlineSince);
                }

                const suffix = inProgressCount == 0 ? '' : ` - ${inProgressCount} ${inProgressCount === 1 ? 'job' : 'jobs'} in progress`;

                return schedulerName + suffix;
            },
            this._applicationModel.isOffline,
            this._applicationModel.schedulerName,
            this._applicationModel.inProgressCount
        ).listen(composedTitle => this.title.setValue(composedTitle));

        this._initialData = null;
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

        const syncFaviconWithSchedulerData = (data: SchedulerData) => {
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
        const
            stepEnvironment = this.wrapWithRetry(
                () => {
                    this.statusMessage.setValue('Loading environment settings');
                    return this._commandService.executeCommand<EnvironmentData>(new GetEnvironmentDataCommand());
                }),

            stepData = stepEnvironment.then(
                (envData: EnvironmentData) => this.wrapWithRetry(
                    () => {
                        /**
                         * We need to initialize the timeline before first call
                         * to getData method to handle event from this call.
                         */
                        this._timelineInitializer = new TimelineInitializer(envData.TimelineSpan);
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
                                schedulerData: schedulerData
                            };
                        });
                    }
                ));

        stepData.done(data => {
            this.applicationViewModel = new ApplicationViewModel(
                this._applicationModel,
                this._commandService,
                data.envData,
                this._notificationService,
                this._timelineInitializer);

            this._initialData = data.schedulerData;

            /**
             * That would trigger application services.
             */
            this._applicationModel.setData(data.schedulerData);
            this.status.setValue(true);
        });
    }

    private wrapWithRetry<T>(payload: () => JQueryPromise<T>) : JQueryPromise<T> {
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
            .always(() => {
                __each(disposables, x => x.dispose());
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