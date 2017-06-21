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

import NotificationsView from './notification/notifications-view';

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

        const dialogsConfig = [
            { viewModel: SchedulerDetailsViewModel, view: SchedulerDetailsView },
            { viewModel: TriggerDialogViewModel, view: TriggerDialogView },
            { viewModel: JobDetailsViewModel, view: JobDetailsView }
        ];

        dom('.js_notifications').render(new NotificationsView(), viewModel.notificationService.notifications);
        dom('.js_dialogsContainer').render(new DialogsViewFactory().createView(dialogsConfig), viewModel.dialogManager);
    }
}
