import { CommandService } from './services';
import { ApplicationModel } from './application-model';
import { DataLoader } from './data-loader';
import { MainAsideViewModel } from './main-aside/aside.view-model';
import { MainAsideView } from './main-aside/aside.view';

import TEMPLATE from './application.tmpl.html';

export class Application {
    run() {
        const commandService = new CommandService(),
            applicationModel = new ApplicationModel(),
            dataLoader = new DataLoader(applicationModel, commandService);

        /*
        

        
        var applicationViewModel = new ApplicationViewModel(applicationModel, schedulerService);*/

        commandService.onCommandFailed.listen(console.log); // todo

        js.dom('#application').render(ApplicationView, new ApplicationViewModel(applicationModel));

        dataLoader.start();

        /*
        schedulerService.getData().done(data => {
            applicationModel.setData(data);
        }).then(() => schedulerService.executeCommand(new GetEnvironmentDataCommand()).done(data => applicationViewModel.setEnvoronmentData(data)));
        */
    }    
}

class ApplicationView implements js.IView<ApplicationViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: ApplicationViewModel) {
        dom('.mainAside').render(MainAsideView, viewModel.mainAside);
    }
}

class ApplicationViewModel {

    mainAside: MainAsideViewModel = new MainAsideViewModel(this.application);

    constructor(
        private application: ApplicationModel) {
        
    }
    
}