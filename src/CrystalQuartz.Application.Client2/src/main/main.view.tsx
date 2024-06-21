import { DomElement, HtmlDefinition, View } from 'john-smith/view';
import { MainViewModel } from './main.view-model';
import { List, Value } from 'john-smith/view/components';
import 'john-smith/binding/ext/bind';
import { MainAsideView } from './main-aside/aside.view';
import MainHeaderView from './main-header/header-view';
import { JobGroupView } from './main-content/job-group/job-group-view';
import SchedulerDetailsViewModel from '../dialogs/scheduler-details/scheduler-details-view-model';
import SchedulerDetailsView from '../dialogs/scheduler-details/scheduler-details-view';
import JobDetailsView from '../dialogs/job-details/job-details-view';
import ActivityDetailsView from '../dialogs/activity-details/activity-details-view';
import { TriggerDetailsView } from '../dialogs/trigger-details/trigger-details-view';
import { ScheduleJobView } from '../dialogs/schedule-job/schedule-job-view';
import JobDetailsViewModel from '../dialogs/job-details/job-details-view-model';
import ActivityDetailsViewModel from '../dialogs/activity-details/activity-details-view-model';
import { TriggerDetailsViewModel } from '../dialogs/trigger-details/trigger-details-view-model';
import { ScheduleJobViewModel } from '../dialogs/schedule-job/schedule-job-view-model';
import DialogsViewFactory, { IDialogConfig } from '../dialogs/dialogs-view-factory';
import { TimelineTooltipsView } from '../timeline/timeline-tooltips-view';
import { NativeDomEngine } from 'john-smith/view/dom-engine-native';

export class MainView implements View {
    constructor(private readonly viewModel: MainViewModel) {
    }

    template(): HtmlDefinition {
        let schedulerDetailsDialog: IDialogConfig<SchedulerDetailsViewModel> = { viewModel: SchedulerDetailsViewModel, view: SchedulerDetailsView };

        const dialogsConfig: IDialogConfig<any>[] = [
            schedulerDetailsDialog,
            { viewModel: JobDetailsViewModel, view: JobDetailsView },
            { viewModel: ActivityDetailsViewModel, view: ActivityDetailsView },
            { viewModel: TriggerDetailsViewModel, view: TriggerDetailsView },
            { viewModel: ScheduleJobViewModel, view: ScheduleJobView }
        ];

        // dom('.js_offline_mode').observes(viewModel.offlineMode, OfflineModeView);

        // dom('.js_notifications').render(new NotificationsView(), viewModel.notificationService.notifications);

        let dialogManagerView = new DialogsViewFactory().createView(dialogsConfig);

        let tooltipsContainer: DomElement | null = null;

        const tooltipsContainerWidthCalculator = (): number => {
            if (tooltipsContainer === null) {
                return 0;
            }

            return ((tooltipsContainer as any).element as HTMLElement).clientWidth;
        }

        return <div>
        <section class="mainAside">
            <Value view={MainAsideView} model={this.viewModel.mainAside}></Value>
        </section>

        <div class="mainHeader">
            <Value view={MainHeaderView} model={this.viewModel.mainHeader}></Value>
        </div>

        <section class="main-container">
            <div class="scrollable-area">
                <section class="js_timeline_back_layer timeline-back-layer" $bind={element => {
                    tooltipsContainer = element
                }}>
                    <Value
                        view={TimelineTooltipsView}
                        model={{
                            timeline: this.viewModel.timeline,
                            globalActivitiesSynchronizer: this.viewModel.globalActivitiesSynchronizer,
                            containerWidthCalculator: tooltipsContainerWidthCalculator
                        }}></Value>
                </section>
                <section id="jobsContainer">
                    <List view={JobGroupView} model={this.viewModel.jobGroups}></List>
                </section>
            </div>
        </section>

        <footer class="main-footer">
            <div class="pull-left">
                <div class="cq-version-container">
                    CrystalQuartz Panel <span id="selfVersion" class="cq-version">{this.viewModel.environment.SelfVersion}</span>
                </div>
                <div class="cq-version-container visible-lg-block">
                    Quartz.NET <span id="quartzVersion" class="cq-version">{this.viewModel.environment.QuartzVersion}</span>
                </div>
                <div class="cq-version-container visible-lg-block">
                    Host Platform <span id="dotNetVersion" class="cq-version">{this.viewModel.environment.DotNetVersion}</span>
                </div>
            </div>

            <div class="pull-right">
                <span id="autoUpdateMessage">{this.viewModel.autoUpdateMessage}</span>
            </div>
        </footer>

        <div class="js_notifications"></div>

        <div class="js_offline_mode"></div>

            <div class="js_dialogsContainer">
                <Value view={dialogManagerView} model={this.viewModel.dialogManager}></Value>
            </div>
        </div>
    }
}
