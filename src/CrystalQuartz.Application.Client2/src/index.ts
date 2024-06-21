import { Application } from 'john-smith';
import { ApplicationView } from './application.view';
import { ApplicationViewModel } from './application.view-model';
import { StartupView } from './startup/startup.view';
import { FaviconStatus, StartupViewModel } from './startup/startup.view-model';
import { ANALYZE_LOCATION } from './startup/headers-extractor';

import { ApplicationModel } from './application-model';
import { CommandService } from './services';
import { DefaultNotificationService } from './notification/notification-service';
import { FaviconRenderer } from './startup/favicon-renderer';
import { MainView } from './main/main.view';
import { MainViewModel } from './main/main.view-model';

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

startupViewModel.complete.listen(data => {
    if (data) {
        application.render(body, MainView, new MainViewModel(applicationModel, commandService, data.environmentData, notificationService, data.timelineInitializer));
        startupView.dispose();
    }
})

const startupView = application.render(body, StartupView, startupViewModel);


startupViewModel.start();
