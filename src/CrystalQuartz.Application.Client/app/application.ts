import { CommandService } from './services';
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

import TEMPLATE from './application.tmpl.html';

export class Application {
    run() {
        const commandService = new CommandService(),
            applicationModel = new ApplicationModel(),
            dataLoader = new DataLoader(applicationModel, commandService);

        /*
        

        
        var applicationViewModel = new ApplicationViewModel(applicationModel, schedulerService);*/

        commandService.onCommandFailed.listen(console.log); // todo

        js.dom('#application').render(ApplicationView, new ApplicationViewModel(applicationModel, commandService));

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
        dom('.mainHeader').render(MainHeaderView, viewModel.mainHeader);
        dom('#jobsContainer').observes(viewModel.jobGroups, JobGroupView);
    }
}

class ApplicationViewModel {
    private groupsSynchronizer: ActivitiesSynschronizer<JobGroup, JobGroupViewModel>;

    timeline = new Timeline();

    mainAside = new MainAsideViewModel(this.application);
    mainHeader = new MainHeaderViewModel(this.timeline);

    jobGroups = js.observableList<JobGroupViewModel>();

    constructor(
        private application: ApplicationModel,
        private commandService: CommandService) {

        this.groupsSynchronizer = new ActivitiesSynschronizer<JobGroup, JobGroupViewModel>(
            (group: JobGroup, groupViewModel: JobGroupViewModel) => group.Name === groupViewModel.name,
            (group: JobGroup) => new JobGroupViewModel(group, this.commandService, this.application, this.timeline),
            this.jobGroups);

        application.onDataChanged.listen(data => this.setData(data));

        this.initTimeline();
    }

    private setData(data: SchedulerData) {
        this.groupsSynchronizer.sync(data.JobGroups);
    }

    initTimeline() {
        this.timeline.init();
        this.commandService.onEvent.listen(event => {
            var slotKey = event.Event.UniqueTriggerKey;
                //event.Event.Group + '/' + event.Event.Job + '/' + event.Event.Trigger;

            if (event.Event.TypeCode === 'TRIGGER_FIRED') {

                var slot = this.timeline.findSlotBy(slotKey) || this.timeline.addSlot({ key: slotKey, title: slotKey });

                this.timeline.addActivity(
                    slot,
                    {
                        key: event.Event.FireInstanceId,
                        startedAt: event.Date
                    });
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