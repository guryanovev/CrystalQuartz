import { OptionalDisposables } from 'john-smith/common';
import { DomElement } from 'john-smith/view';
import { List } from 'john-smith/view/components';
import { DomEngine } from 'john-smith/view/dom-engine';
import { PropertyView } from '../common/property-view';
import ViewBase from '../dialog-view-base';
import ViewModel from './scheduler-details-view-model';
import SchedulerDetailsViewModel from './scheduler-details-view-model';

export default class SchedulerDetailsView extends ViewBase<ViewModel> {
  public constructor(viewModel: SchedulerDetailsViewModel) {
    super(viewModel, 'Scheduler Details');
  }

  public onInit(root: DomElement | null, domEngine: DomEngine): OptionalDisposables {
    this.viewModel.loadDetails();

    return super.onInit(root, domEngine);
  }

  protected getBodyContent(): JSX.IElement {
    return (
      <section class="dialog-content dialog-content-no-padding">
        <div class="properties-panel">
          <header>Summary</header>
          <table class="js_summary">
            <List view={PropertyView} model={this.viewModel.summary}></List>
          </table>
        </div>

        <div class="properties-panel">
          <header>Status</header>
          <table class="js_status">
            <List view={PropertyView} model={this.viewModel.status}></List>
          </table>
        </div>

        <div class="properties-panel">
          <header>Job Store</header>
          <table class="js_jobStore">
            <List view={PropertyView} model={this.viewModel.jobStore}></List>
          </table>
        </div>

        <div class="properties-panel">
          <header>Thread Pool</header>
          <table class="js_threadPool">
            <List view={PropertyView} model={this.viewModel.threadPool}></List>
          </table>
        </div>
      </section>
    );
  }
}
