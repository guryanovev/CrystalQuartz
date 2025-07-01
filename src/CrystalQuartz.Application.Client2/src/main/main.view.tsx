import { DomElement, HtmlDefinition, View } from 'john-smith/view';
import { List, Value } from 'john-smith/view/components';
import { MainViewModel } from './main.view-model';
import 'john-smith/binding/ext/bind';
import TimelineGlobalActivityView from '../timeline/timeline-global-activity-view';
import { TimelineTooltipsView } from '../timeline/timeline-tooltips-view';
import { JobGroupView } from './main-content/job-group/job-group-view';

export class MainView implements View {
  public constructor(private readonly viewModel: MainViewModel) {}

  public template(): HtmlDefinition {
    let tooltipsContainer: DomElement | null = null;

    const tooltipsContainerWidthCalculator = (): number => {
      if (tooltipsContainer === null) {
        return 0;
      }

      return ((tooltipsContainer as unknown as { element: HTMLElement }).element as HTMLElement)
        .clientWidth;
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
