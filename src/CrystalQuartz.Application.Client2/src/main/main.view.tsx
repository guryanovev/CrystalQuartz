import { DomElement, HtmlDefinition, View } from 'john-smith/view';
import { List, Value } from 'john-smith/view/components';
import { MainViewModel } from './main.view-model';
import 'john-smith/binding/ext/bind';
import ActivityDetailsView from '../dialogs/activity-details/activity-details-view';
import ActivityDetailsViewModel from '../dialogs/activity-details/activity-details-view-model';
import { DialogOverlayView } from '../dialogs/dialogs-overlay-view';
import DialogsViewFactory, { IDialogConfig } from '../dialogs/dialogs-view-factory';
import JobDetailsView from '../dialogs/job-details/job-details-view';
import JobDetailsViewModel from '../dialogs/job-details/job-details-view-model';
import { ScheduleJobView } from '../dialogs/schedule-job/schedule-job-view';
import { ScheduleJobViewModel } from '../dialogs/schedule-job/schedule-job-view-model';
import SchedulerDetailsView from '../dialogs/scheduler-details/scheduler-details-view';
import SchedulerDetailsViewModel from '../dialogs/scheduler-details/scheduler-details-view-model';
import { TriggerDetailsView } from '../dialogs/trigger-details/trigger-details-view';
import { TriggerDetailsViewModel } from '../dialogs/trigger-details/trigger-details-view-model';
import TimelineGlobalActivityView from '../timeline/timeline-global-activity-view';
import { TimelineTooltipsView } from '../timeline/timeline-tooltips-view';
import { JobGroupView } from './main-content/job-group/job-group-view';

export class MainView implements View {
  constructor(private readonly viewModel: MainViewModel) {}

  template(): HtmlDefinition {
    let tooltipsContainer: DomElement | null = null;

    const tooltipsContainerWidthCalculator = (): number => {
      if (tooltipsContainer === null) {
        return 0;
      }

      return ((tooltipsContainer as any).element as HTMLElement).clientWidth;
    };

    return (
      <main class="main-container">
        <div class="scrollable-area">
          <section
            class="js_timeline_back_layer timeline-back-layer"
            $bind={(element) => {
              tooltipsContainer = element;
            }}
          >
            <Value
              view={TimelineTooltipsView}
              model={{
                timeline: this.viewModel.timeline,
                globalActivitiesSynchronizer: this.viewModel.globalActivitiesSynchronizer,
                containerWidthCalculator: tooltipsContainerWidthCalculator,
              }}
            ></Value>
            <List
              view={TimelineGlobalActivityView}
              model={this.viewModel.timeline.globalSlot.activities}
            ></List>
          </section>
          <section class="job-groups-container">
            <List view={JobGroupView} model={this.viewModel.jobGroups}></List>
          </section>
        </div>
      </main>
    );
  }
}
