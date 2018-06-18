import { CommandService, ErrorInfo } from '../services';
import { GetEnvironmentDataCommand, GetDataCommand } from '../commands/global-commands';
import { SchedulerData, EnvironmentData } from '../api';
import { ApplicationModel } from '../application-model';
import { DataLoader } from '../data-loader';
import ApplicationViewModel from '../application-view-model';

import { DefaultNotificationService } from '../notification/notification-service';
import {RetryTimer} from "../global/timer";

import __each from 'lodash/each';
import {TimelineInitializer} from "../timeline/timeline-initializer";

export default class BootstrapperViewModel {
    statusMessage = new js.ObservableValue<string>();
    status = new js.ObservableValue<boolean>();
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

    start() {
        this._commandService = new CommandService(),
        this._applicationModel = new ApplicationModel(),
        this._notificationService = new DefaultNotificationService(),
        this._dataLoader = new DataLoader(this._applicationModel, this._commandService);

        this.performLoading2();
    }

    performLoading2() {
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


    // performLoading() {
    //     this.statusMessage.setValue('Loading environment settings');
    //     const initPromise = this._commandService.executeCommand<EnvironmentData>(new GetEnvironmentDataCommand())
    //         .then(envData => {
    //
    //             if (envData.CustomCssUrl) {
    //                 this.statusMessage.setValue('Loading custom styles');
    //                 this.customStylesUrl.setValue((envData.CustomCssUrl));
    //             }
    //
    //             this.statusMessage.setValue('Loading initial scheduler data');
    //
    //             return this._commandService.executeCommand<SchedulerData>(new GetDataCommand()).then(schedulerData => {
    //                 this.statusMessage.setValue('Done');
    //
    //                 return {
    //                     envData: envData,
    //                     schedulerData: schedulerData
    //                 };
    //             });
    //         });
    //
    //     initPromise.done(data => {
    //         this.applicationViewModel = new ApplicationViewModel(this._applicationModel, this._commandService, data.envData, this._notificationService);
    //
    //         /**
    //          * That would trigger application services.
    //          */
    //         this._applicationModel.setData(data.schedulerData);
    //         this.status.setValue(true);
    //     }).fail((error: ErrorInfo) => {
    //         this.failed.setValue(true);
    //         this.errorMessage.setValue(error.errorMessage);
    //
    //         this.startRetryCountdown(this._currentRetryInterval);
    //         this._currentRetryInterval = Math.min(this._currentRetryInterval * 2, this.MAX_RETRY_INTERVAL);
    //     });
    // }

    //private _autoRetryTimer: number;

    /*
    startRetryCountdown(updateIn: number) {
        if (updateIn <= 0) {
            this.failed.setValue(false);
            this.retryIn.setValue('is in progress');
            this.statusMessage.setValue('Retry...');
            window.setTimeout(() => this.performLoading(), 2000);
        } else {
            this.retryIn.setValue('in ' + updateIn + ' sec');
            this._autoRetryTimer = window.setTimeout(() => this.startRetryCountdown(updateIn - 1), 1000);
        }
    }

    cancelAutoRetry() {
        this.clearAutoRetryTimer();
        this.retryIn.setValue('canceled');
    }

    retryNow() {
        this.clearAutoRetryTimer();
        this.startRetryCountdown(0);
    }*/

    /*
    private clearAutoRetryTimer() {
        if (this._autoRetryTimer) {
            clearTimeout(this._autoRetryTimer);
            this._autoRetryTimer = null;
        }
    }*/
}