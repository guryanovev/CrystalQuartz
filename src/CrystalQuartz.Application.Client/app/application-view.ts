import ViewModel from './application-view-model';
import TEMPLATE from './application.tmpl.html';

import { MainAsideView } from './main-aside/aside.view';
import { JobGroupView } from './main-content/job-group/job-group-view';
import MainHeaderView from './main-header/header-view';

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
    }
}
