import ViewModel from './application-view-model';
import TEMPLATE from './application.tmpl.html';

import { MainAsideView } from './main-aside/aside.view';
import { JobGroupView } from './main-content/job-group/job-group-view';
import MainHeaderView from './main-header/header-view';

import DialogsViewFactory from './dialogs/dialogs-view-factory'
import SchedulerDetailsView from './dialogs/scheduler-details/scheduler-details-view';
import SchedulerDetailsViewModel from './dialogs/scheduler-details/scheduler-details-view-model';
import TriggerDialogView from './dialogs/trigger/trigger-dialog-view';
import TriggerDialogViewModel from './dialogs/trigger/trigger-dialog-view-model';
import JobDetailsView from './dialogs/job-details/job-details-view';
import JobDetailsViewModel from './dialogs/job-details/job-details-view-model';
import { TriggerDetailsView } from './dialogs/trigger-details/trigger-details-view';
import { TriggerDetailsViewModel } from './dialogs/trigger-details/trigger-details-view-model';
import ActivityDetailsViewModel from './dialogs/activity-details/activity-details-view-model';
import ActivityDetailsView from './dialogs/activity-details/activity-details-view';

import NotificationsView from './notification/notifications-view';

import TimelineGlobalActivityView from './timeline/timeline-global-activity-view';
import TimelineTooltipsView from './timeline/timeline-tooltips-view';
import {OfflineModeView} from "./offline-mode/offline-mode-view";
import {ScheduleJobViewModel} from './dialogs/schedule-job/schedule-job-view-model';
import {ScheduleJobView} from './dialogs/schedule-job/schedule-job-view';

export default class ApplicationView implements js.IView<ViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: ViewModel) {
        const environment = viewModel.environment;

        dom('#selfVersion').$.text(environment.SelfVersion);
        dom('#quartzVersion').$.text(environment.QuartzVersion);
        dom('#dotNetVersion').$.text(environment.DotNetVersion);
        dom('#autoUpdateMessage').observes(viewModel.autoUpdateMessage);

        dom('.mainAside').render(MainAsideView, viewModel.mainAside);
        dom('.mainHeader').render(MainHeaderView, viewModel.mainHeader);
        dom('#jobsContainer').observes(viewModel.jobGroups, JobGroupView);
        dom('.js_timeline_back_layer').observes(viewModel.timeline.globalSlot.activities, TimelineGlobalActivityView);

        const timelineTooltipsRenderer = new TimelineTooltipsView(viewModel.globalActivitiesSynchronizer);
        dom.manager.manage(timelineTooltipsRenderer);

        timelineTooltipsRenderer.render(dom('.js_timeline_back_layer'), viewModel.timeline);

        const dialogsConfig = [
            { viewModel: SchedulerDetailsViewModel, view: SchedulerDetailsView },
            { viewModel: TriggerDialogViewModel, view: TriggerDialogView },
            { viewModel: JobDetailsViewModel, view: JobDetailsView },
            { viewModel: ActivityDetailsViewModel, view: ActivityDetailsView },
            { viewModel: TriggerDetailsViewModel, view: TriggerDetailsView },
            { viewModel: ScheduleJobViewModel, view: ScheduleJobView }
        ];

        dom('.js_offline_mode').observes(viewModel.offlineMode, OfflineModeView);

        dom('.js_notifications').render(new NotificationsView(), viewModel.notificationService.notifications);
        dom('.js_dialogsContainer').render(new DialogsViewFactory().createView(dialogsConfig), viewModel.dialogManager);
    }
}
