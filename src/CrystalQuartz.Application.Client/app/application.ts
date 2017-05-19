//import { js } from '../lib/john-smith';

import TEMPLATE from './application.tmpl.html';

class TestView implements js.IView<any> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: any) {
    }
}

export class Application {
    run() {
        /*
        var applicationModel = new ApplicationModel();

        var schedulerService = new SchedulerService();
        var applicationViewModel = new ApplicationViewModel(applicationModel, schedulerService);*/

        js.dom('#application').render(TestView, {});

        /*
        schedulerService.getData().done(data => {
            applicationModel.setData(data);
        }).then(() => schedulerService.executeCommand(new GetEnvironmentDataCommand()).done(data => applicationViewModel.setEnvoronmentData(data)));
        */
    }    
}