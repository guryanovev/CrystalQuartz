import { CommandService } from './services';
import { GetEnvironmentDataCommand, GetDataCommand } from './commands/global-commands';

import { ApplicationModel } from './application-model';
import { DataLoader } from './data-loader';
import { MainAsideViewModel } from './main-aside/aside.view-model';
import { MainAsideView } from './main-aside/aside.view';

import ActivitiesSynschronizer from './main-content/activities-synschronizer';
import { JobGroup, SchedulerData } from './api';
import { JobGroupViewModel } from './main-content/job-group/job-group-view-model';
import { JobGroupView } from './main-content/job-group/job-group-view';
import MainHeaderViewModel from './main-header/header-view-model';
import MainHeaderView from './main-header/header-view';

import Timeline from './timeline/timeline';



//export class Application {
//    run() {
//        const commandService = new CommandService(),
//            applicationModel = new ApplicationModel(),
//            dataLoader = new DataLoader(applicationModel, commandService);
//
//        const $appLoadingOverlay = $('.app-loading-overlay'),
//              $appLoadingContainer = $('.app-loading-container')/*,
//              $appLoadingMessage = $('.app-loading-container p')*/;
//
//        js.dom('foo')
//        //$('.app-loading-overlay').css('opacity', 0);
//
//        commandService.onCommandFailed.listen(console.log); // todo
//
//        js.dom('#application').render(ApplicationView, new ApplicationViewModel(applicationModel, commandService));
//
//        //dataLoader.start();
//
//        $('.app-loading-container p').slideUp('slow');
//        $('.app-loading-container div').append('<p>Loading environment settins</p>');
//
//        //$appLoadingMessage.text('Loading environment settins');
//        commandService.executeCommand(new GetEnvironmentDataCommand).done(envData => {
//
//            //$appLoadingMessage.text('Loading initial data');
//
//            commandService.executeCommand<SchedulerData>(new GetDataCommand()).done(data => {
//                applicationModel.setData(data);
//                $appLoadingOverlay.css('opacity', 0);
//
//                setTimeout(() => { $appLoadingOverlay.remove() }, 2000);
//
//                //$appLoadingMessage.text('Done');
//                $appLoadingContainer.delay(3000).fadeOut('slow');
//            });
//
//            //dataLoader.start();
//        });
//
//        /*
//        schedulerService.getData().done(data => {
//            applicationModel.setData(data);
//        }).then(() => schedulerService.executeCommand(new GetEnvironmentDataCommand()).done(data => applicationViewModel.setEnvoronmentData(data)));
//        */
//    }
//
//    
//}
//
//
