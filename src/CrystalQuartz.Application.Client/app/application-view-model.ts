import { CommandService } from './services';
import { GetEnvironmentDataCommand, GetDataCommand } from './commands/global-commands';

import { ApplicationModel } from './application-model';
import { DataLoader } from './data-loader';
import { MainAsideViewModel } from './main-aside/aside.view-model';

import ActivitiesSynschronizer from './main-content/activities-synschronizer';
import { JobGroup, SchedulerData, EnvironmentData } from './api';
import { JobGroupViewModel } from './main-content/job-group/job-group-view-model';
import MainHeaderViewModel from './main-header/header-view-model';

import Timeline from './timeline/timeline';

import { DialogManager } from './dialogs/dialog-manager';

export default class ApplicationViewModel {
    private groupsSynchronizer: ActivitiesSynschronizer<JobGroup, JobGroupViewModel>;

    dialogManager = new DialogManager();

    timeline = new Timeline();

    mainAside = new MainAsideViewModel(this.application);
    mainHeader = new MainHeaderViewModel(this.timeline, this.commandService, this.application, this.dialogManager);
    
    jobGroups = js.observableList<JobGroupViewModel>();

    constructor(
        private application: ApplicationModel,
        private commandService: CommandService,
        public environment: EnvironmentData) {

        this.groupsSynchronizer = new ActivitiesSynschronizer<JobGroup, JobGroupViewModel>(
            (group: JobGroup, groupViewModel: JobGroupViewModel) => group.Name === groupViewModel.name,
            (group: JobGroup) => new JobGroupViewModel(group, this.commandService, this.application, this.timeline),
            this.jobGroups);

        application.onDataChanged.listen(data => this.setData(data));

        this.initTimeline();
    }

    get autoUpdateMessage() {
        return this.application.autoUpdateMessage;
    }

    private setData(data: SchedulerData) {
        this.groupsSynchronizer.sync(data.JobGroups);
        this.mainHeader.updateFrom(data);
    }

    initTimeline() {
        this.timeline.init();
        this.commandService.onEvent.listen(event => {
            const slotKey = event.Event.UniqueTriggerKey;

            if (event.Event.TypeCode === 'TRIGGER_FIRED') {

                const slot = this.timeline.findSlotBy(slotKey) || this.timeline.addSlot({ key: slotKey }),
                    activityKey = event.Event.FireInstanceId,
                    existingActivity = slot.findActivityBy(activityKey);

                if (!existingActivity) {
                    this.timeline.addActivity(
                        slot,
                        {
                            key: event.Event.FireInstanceId,
                            startedAt: event.Date
                        });
                }
            } else if (event.Event.TypeCode === 'TRIGGER_COMPLETE') {
                const completeSlot = this.timeline.findSlotBy(slotKey);
                if (completeSlot) {
                    const activity = completeSlot.findActivityBy(event.Event.FireInstanceId);
                    if (activity) {
                        activity.complete(event.Date);
                    }
                }
            }
        });
    }
}