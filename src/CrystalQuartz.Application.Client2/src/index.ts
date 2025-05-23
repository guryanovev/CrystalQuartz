import { Application } from 'john-smith';
import { StartupView } from './startup/startup.view';
import { FaviconStatus, StartupViewModel } from './startup/startup.view-model';
import { ANALYZE_LOCATION } from './startup/headers-extractor';

import { ApplicationModel } from './application-model';
import { CommandService } from './services';
import { DefaultNotificationService } from './notification/notification-service';
import { FaviconRenderer } from './startup/favicon-renderer';
import { MainView } from './main/main.view';
import { MainViewModel } from './main/main.view-model';
import MainHeaderView from './main/main-header/header-view';
import { MainFooterView } from './main/main-footer/main-footer.view';
import { MainAsideView } from './main/main-aside/aside.view';
import { OfflineModeView } from './main/offline-mode/offline-mode-view';
import { OfflineModeContainerView } from './main/offline-mode/offline-mode-container';
import DialogsViewFactory, { IDialogConfig } from './dialogs/dialogs-view-factory';
import SchedulerDetailsViewModel from './dialogs/scheduler-details/scheduler-details-view-model';
import SchedulerDetailsView from './dialogs/scheduler-details/scheduler-details-view';
import JobDetailsViewModel from './dialogs/job-details/job-details-view-model';
import JobDetailsView from './dialogs/job-details/job-details-view';
import ActivityDetailsViewModel from './dialogs/activity-details/activity-details-view-model';
import ActivityDetailsView from './dialogs/activity-details/activity-details-view';
import { TriggerDetailsViewModel } from './dialogs/trigger-details/trigger-details-view-model';
import { TriggerDetailsView } from './dialogs/trigger-details/trigger-details-view';
import { ScheduleJobViewModel } from './dialogs/schedule-job/schedule-job-view-model';
import { ScheduleJobView } from './dialogs/schedule-job/schedule-job-view';
import { DialogOverlayView } from './dialogs/dialogs-overlay-view';

// import 'bootstrap';
// import Alert from 'bootstrap/js/dist/dropdown'
// import 'bootstrap/js/dist/dropdown';

const application = new Application();

const body = document.body;

const { headers, url } = ANALYZE_LOCATION();
const commandService = new CommandService(url, headers);
const applicationModel = new ApplicationModel();
const notificationService = new DefaultNotificationService()

const startupViewModel = new StartupViewModel(commandService, applicationModel, notificationService);

const faviconRenderer = new FaviconRenderer();
startupViewModel.favicon.listen((faviconStatus:FaviconStatus | null/*, oldFaviconStatus: FaviconStatus */) => {
    if (faviconStatus !== null /* && faviconStatus !== undefined && faviconStatus !== oldFaviconStatus */) {
        faviconRenderer.render(faviconStatus);
    }
});

startupViewModel.title.listen(title => {
    if (title) {
        document.title = title;
    }
});

startupViewModel.dataFetched.listen(data => {
    if (data) {
        const mainViewModel = new MainViewModel(
            applicationModel,
            commandService,
            data.environmentData,
            notificationService,
            data.timelineInitializer);

        const dialogsConfig: IDialogConfig<any>[] = [
            { viewModel: SchedulerDetailsViewModel, view: SchedulerDetailsView },
            { viewModel: JobDetailsViewModel, view: JobDetailsView },
            { viewModel: ActivityDetailsViewModel, view: ActivityDetailsView },
            { viewModel: TriggerDetailsViewModel, view: TriggerDetailsView },
            { viewModel: ScheduleJobViewModel, view: ScheduleJobView }
        ];

        const dialogManagerView = new DialogsViewFactory().createView(dialogsConfig);

        application.render(body, MainAsideView, mainViewModel.mainAside);
        application.render(body, MainHeaderView, mainViewModel.mainHeader);
        application.render(body, OfflineModeContainerView, mainViewModel);
        application.render(body, MainView, mainViewModel);
        application.render(body, MainFooterView, mainViewModel);

        application.render(body, DialogOverlayView, mainViewModel.dialogManager);
        application.render(body, dialogManagerView, mainViewModel.dialogManager);
    }
});

startupViewModel.complete.listen(() => {
    startupView.dispose();
})


const startupView = application.render(body, StartupView, startupViewModel);
startupViewModel.start();
