import { CommandService } from './services';
import { GetEnvironmentDataCommand, GetDataCommand } from './commands/global-commands';

import { ApplicationModel } from './application-model';
import { DataLoader } from './data-loader';
import { MainAsideViewModel } from './main-aside/aside.view-model';

import ActivitiesSynschronizer from './main-content/activities-synschronizer';
import { JobGroup, SchedulerData, EnvironmentData, SchedulerEvent, SchedulerEventData, SchedulerEventScope, SchedulerEventType } from './api';
import { JobGroupViewModel } from './main-content/job-group/job-group-view-model';
import MainHeaderViewModel from './main-header/header-view-model';

import Timeline from './timeline/timeline';
import { TimelineGlobalActivity } from './timeline/timeline-global-activity';

import { DialogManager } from './dialogs/dialog-manager';

import { INotificationService, DefaultNotificationService } from './notification/notification-service';
import { SchedulerStateService } from './scheduler-state-service';

import GlobalActivitiesSynchronizer from './global-activities-synchronizer';

export default class ApplicationViewModel {
    private groupsSynchronizer: ActivitiesSynschronizer<JobGroup, JobGroupViewModel>;
    private _schedulerStateService = new SchedulerStateService();
    private _globalActivitiesSynchronizer:GlobalActivitiesSynchronizer;

    dialogManager = new DialogManager();

    timeline = new Timeline();

    mainAside = new MainAsideViewModel(this.application);
    mainHeader = new MainHeaderViewModel(this.timeline, this.commandService, this.application, this.dialogManager);
    
    jobGroups = js.observableList<JobGroupViewModel>();

    constructor(
        private application: ApplicationModel,
        private commandService: CommandService,
        public environment: EnvironmentData,
        public notificationService: DefaultNotificationService) {

        this.groupsSynchronizer = new ActivitiesSynschronizer<JobGroup, JobGroupViewModel>(
            (group: JobGroup, groupViewModel: JobGroupViewModel) => group.Name === groupViewModel.name,
            (group: JobGroup) => new JobGroupViewModel(group, this.commandService, this.application, this.timeline, this.dialogManager, this._schedulerStateService),
            this.jobGroups);

        application.onDataChanged.listen(data => this.setData(data));

        this._globalActivitiesSynchronizer = new GlobalActivitiesSynchronizer(this.timeline);

        this.initTimeline();
    }

    get autoUpdateMessage() {
        return this.application.autoUpdateMessage;
    }

    private setData(data: SchedulerData) {
        this.groupsSynchronizer.sync(data.JobGroups);
        this.mainHeader.updateFrom(data);
        this._schedulerStateService.synsFrom(data);
        this._globalActivitiesSynchronizer.updateFrom(data);
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
                    description = this.composeGlobalActivityDescription(eventData),
                    globalActivity = new TimelineGlobalActivity('test', event.Date, eventData.ItemKey, scope, typeCode, description);

                this._globalActivitiesSynchronizer.updateActivity(globalActivity);

                this.timeline.globalSlot.activities.add(globalActivity);
            } else {

                const slotKey = eventData.ItemKey,
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

    private composeGlobalActivityDescription(data: SchedulerEventData) {
        return SchedulerEventScope[data.Scope] + ' ' + SchedulerEventType[data.EventType].toLowerCase();
    }
}