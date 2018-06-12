import { CommandService } from './services';
import { ApplicationModel } from './application-model';
import { MainAsideViewModel } from './main-aside/aside.view-model';

import ActivitiesSynschronizer from './main-content/activities-synschronizer';
import { JobGroup, SchedulerData, EnvironmentData, SchedulerEventScope, SchedulerEventType } from './api';
import { JobGroupViewModel } from './main-content/job-group/job-group-view-model';
import MainHeaderViewModel from './main-header/header-view-model';

import Timeline from './timeline/timeline';

import { DialogManager } from './dialogs/dialog-manager';

import { INotificationService, DefaultNotificationService } from './notification/notification-service';
import { SchedulerStateService } from './scheduler-state-service';

import GlobalActivitiesSynchronizer from './global-activities-synchronizer';
import {OfflineModeViewModel} from "./offline-mode/offline-mode-view-model";
import DateUtils from "./utils/date";

export default class ApplicationViewModel {
    private groupsSynchronizer: ActivitiesSynschronizer<JobGroup, JobGroupViewModel>;
    private _schedulerStateService = new SchedulerStateService();
    private _serverInstanceMarker: number|null = null;

    dialogManager = new DialogManager();

    timeline = new Timeline(this.environment.TimelineSpan || 1000 * 60 * 60);

    mainAside = new MainAsideViewModel(this.application);
    mainHeader = new MainHeaderViewModel(this.timeline, this.commandService, this.application, this.dialogManager);
    
    jobGroups = js.observableList<JobGroupViewModel>();
    offlineMode = new js.ObservableValue<OfflineModeViewModel>();

    globalActivitiesSynchronizer: GlobalActivitiesSynchronizer;

    constructor(
        private application: ApplicationModel,
        private commandService: CommandService,
        public environment: EnvironmentData,
        public notificationService: DefaultNotificationService) {

        commandService.onCommandFailed.listen(error => notificationService.showError(error.errorMessage));
        commandService.onDisconnected.listen(() => application.goOffline());

        this.groupsSynchronizer = new ActivitiesSynschronizer<JobGroup, JobGroupViewModel>(
            (group: JobGroup, groupViewModel: JobGroupViewModel) => group.Name === groupViewModel.name,
            (group: JobGroup) => new JobGroupViewModel(group, this.commandService, this.application, this.timeline, this.dialogManager, this._schedulerStateService),
            this.jobGroups);

        application.onDataChanged.listen(data => this.setData(data));

        application.isOffline.listen(isOffline => {
            const offlineModeViewModel = isOffline ?
                new OfflineModeViewModel(new Date().getTime(), this.commandService, this.application) :
                null;

            this.offlineMode.setValue(offlineModeViewModel);
        });

        this.globalActivitiesSynchronizer = new GlobalActivitiesSynchronizer(this.timeline);

        this.initTimeline();
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

    initTimeline() {
        this.timeline.init();
        this.commandService.onEvent.listen(event => {
            const eventData = event.Data,
                  scope = eventData.Scope,
                  eventType = eventData.EventType,
                  isGlobal = !(scope === SchedulerEventScope.Trigger && (eventType === SchedulerEventType.Fired || eventType === SchedulerEventType.Complete));

            if (isGlobal) {
                const
                    typeCode = SchedulerEventType[eventType].toLowerCase(),
                    options = {
                        occurredAt: event.Date,
                        typeCode: typeCode,
                        itemKey: this.globalActivitiesSynchronizer.makeSlotKey(scope, eventData.ItemKey),
                        scope: scope
                    },
                    globalActivity = this.timeline.addGlobalActivity(options);

                this.globalActivitiesSynchronizer.updateActivity(globalActivity);
            } else {

                const slotKey = this.globalActivitiesSynchronizer.makeSlotKey(scope, eventData.ItemKey),
                      activityKey = eventData.FireInstanceId;

                if (eventType === SchedulerEventType.Fired) {
                    const slot = this.timeline.findSlotBy(slotKey) || this.timeline.addSlot({ key: slotKey }),
                          existingActivity = slot.findActivityBy(activityKey);

                    if (!existingActivity) {
                        this.timeline.addActivity(
                            slot,
                            {
                                key: activityKey,
                                startedAt: event.Date
                            });
                    }
                } else if (eventType === SchedulerEventType.Complete) {
                    const completeSlot = this.timeline.findSlotBy(slotKey);
                    if (completeSlot) {
                        const activity = completeSlot.findActivityBy(activityKey);
                        if (activity) {
                            activity.complete(event.Date);
                        }
                    }
                } 
            }
        });
    }
}