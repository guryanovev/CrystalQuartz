import { CommandService } from '../services';
import { ApplicationModel } from '../application-model';
import { MainAsideViewModel } from './main-aside/aside.view-model';

import ActivitiesSynschronizer from './main-content/activities-synschronizer';
import { JobGroup, SchedulerData, EnvironmentData } from '../api';
// import { JobGroupViewModel } from './main-content/job-group/job-group-view-model';
import MainHeaderViewModel from './main-header/header-view-model';

import Timeline from '../timeline/timeline';

// import { DialogManager } from './dialogs/dialog-manager';

import { INotificationService, DefaultNotificationService } from '../notification/notification-service';
// import { SchedulerStateService } from './scheduler-state-service';

// import GlobalActivitiesSynchronizer from './global-activities-synchronizer';
// import {OfflineModeViewModel} from "./offline-mode/offline-mode-view-model";
import DateUtils from "../utils/date";
import { TimelineInitializer } from "../timeline/timeline-initializer";

import ActivityDetailsViewModel from '../dialogs/activity-details/activity-details-view-model';
import { ObservableList, ObservableValue } from 'john-smith/reactive';
import { DialogManager } from '../dialogs/dialog-manager';
import { JobGroupViewModel } from './main-content/job-group/job-group-view-model';
import GlobalActivitiesSynchronizer from '../global-activities-synchronizer';
import { SchedulerStateService } from '../scheduler-state-service';

export class MainViewModel {
    private groupsSynchronizer: ActivitiesSynschronizer<JobGroup, JobGroupViewModel>;
    private _schedulerStateService = new SchedulerStateService();
    private _serverInstanceMarker: number|null = null;

    dialogManager = new DialogManager();

    timeline: Timeline;

    mainAside: MainAsideViewModel;
    mainHeader: MainHeaderViewModel;

    jobGroups = new ObservableList<JobGroupViewModel>();
    // offlineMode = new ObservableValue<OfflineModeViewModel | null>(null);

    globalActivitiesSynchronizer: GlobalActivitiesSynchronizer;

    constructor(
        private application: ApplicationModel,
        private commandService: CommandService,
        public environment: EnvironmentData,
        public notificationService: DefaultNotificationService,
        timelineInitializer: TimelineInitializer) {

        this.timeline = timelineInitializer.timeline;
        this.globalActivitiesSynchronizer = timelineInitializer.globalActivitiesSynchronizer;

        this.mainAside = new MainAsideViewModel(this.application);
        this.mainHeader = new MainHeaderViewModel(
            this.timeline,
            this.commandService,
            this.application,
            this.dialogManager);

        commandService.onCommandFailed.listen(error => notificationService.showError(error.errorMessage));
        commandService.onDisconnected.listen(() => application.goOffline());

        this.groupsSynchronizer = new ActivitiesSynschronizer<JobGroup, JobGroupViewModel>(
            (group: JobGroup, groupViewModel: JobGroupViewModel) => group.Name === groupViewModel.name,
            (group: JobGroup) => new JobGroupViewModel(group, this.commandService, this.application, this.timeline, this.dialogManager, this._schedulerStateService),
            this.jobGroups);

        application.onDataChanged.listen(data => this.setData(data));

        // application.isOffline.listen(isOffline => {
        //     const offlineModeViewModel = isOffline ?
        //         new OfflineModeViewModel(this.application.offlineSince, this.commandService, this.application) :
        //         null;
        //
        //     this.offlineMode.setValue(offlineModeViewModel);
        // });

        this.timeline.detailsRequested.listen(activity => {
            this.dialogManager.showModal(new ActivityDetailsViewModel(activity), _ => {});
        });
    }

    get autoUpdateMessage() {
        return this.application.autoUpdateMessage;
    }

    private setData(data: SchedulerData) {
        if (this._serverInstanceMarker !== null && this._serverInstanceMarker !== data.ServerInstanceMarker) {
            this.notificationService.showError('Server restart detected at ' + DateUtils.smartDateFormat(new Date().getTime()));
            this.commandService.resetEvents();
            this.timeline.clearSlots();
        }

        this._serverInstanceMarker = data.ServerInstanceMarker;

        this.groupsSynchronizer.sync(data.JobGroups);
        this.mainHeader.updateFrom(data);
        this._schedulerStateService.synsFrom(data);
        this.globalActivitiesSynchronizer.updateFrom(data);
    }
}
