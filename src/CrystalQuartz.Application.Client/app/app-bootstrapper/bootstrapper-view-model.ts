import { CommandService, ErrorInfo } from '../services';
import { GetEnvironmentDataCommand, GetDataCommand } from '../commands/global-commands';
import { SchedulerData, EnvironmentData } from '../api';
import { ApplicationModel } from '../application-model';
import { DataLoader } from '../data-loader';
import ApplicationViewModel from '../application-view-model';

import { DefaultNotificationService } from '../notification/notification-service';

export default class BootstrapperViewModel {
    statusMessage = new js.ObservableValue<string>();
    status = new js.ObservableValue<boolean>();
    failed = new js.ObservableValue<boolean>();
    errorMessage = new js.ObservableValue<string>();
    retryIn = new js.ObservableValue<string>();

    applicationViewModel: ApplicationViewModel;

    private MAX_RETRY_INTERVAL = 60;
    private MIN_RETRY_INTERVAL = 5;

    private _commandService:CommandService;
    private _applicationModel:ApplicationModel;
    private _notificationService:DefaultNotificationService;
    private _dataLoader: DataLoader;
    private _currentRetryInterval: number;

    start() {
        this._commandService = new CommandService(),
        this._applicationModel = new ApplicationModel(),
        this._notificationService = new DefaultNotificationService(),
        this._dataLoader = new DataLoader(this._applicationModel, this._commandService);

        this._commandService.onCommandFailed.listen(error => this._notificationService.showError(error.errorMessage));

        this.performLoading();
        this._currentRetryInterval = this.MIN_RETRY_INTERVAL;
    }

    performLoading() {
        console.log('Loading data');

        this.statusMessage.setValue('Loading environment settings');
        const initPromise = this._commandService.executeCommand<EnvironmentData>(new GetEnvironmentDataCommand())
            .then(envData => {
                this.applicationViewModel = new ApplicationViewModel(this._applicationModel, this._commandService, envData, this._notificationService);
                this.statusMessage.setValue('Loading initial scheduler data');

                return this._commandService.executeCommand<SchedulerData>(new GetDataCommand()).then(schedulerData => {
                    this.statusMessage.setValue('Done');

                    return {
                        envData: envData,
                        schedulerData: schedulerData
                    };
                });
            });

        initPromise.done(data => {
            /**
             * That would trigger application services.
             */
            this._applicationModel.setData(data.schedulerData);
            this.status.setValue(true);
        }).fail((error: ErrorInfo) => {
            this.failed.setValue(true);
            this.errorMessage.setValue(error.errorMessage);

            this.startRetryCountdown(this._currentRetryInterval);
            this._currentRetryInterval = Math.min(this._currentRetryInterval * 2, this.MAX_RETRY_INTERVAL);
        });
    }

    private _autoRetryTimer: number;

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
    }

    private clearAutoRetryTimer() {
        if (this._autoRetryTimer) {
            clearTimeout(this._autoRetryTimer);
            this._autoRetryTimer = null;
        }
    }
}