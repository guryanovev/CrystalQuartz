import { Disposable } from 'john-smith/common';
import { View } from 'john-smith/view';
import { List, Value } from 'john-smith/view/components';
import { OnUnrender } from 'john-smith/view/hooks';
import ActionView from '../../../global/actions/action-view';
import Separator from '../../../global/actions/separator';
import { TimelineSlotView } from '../../../timeline/timeline-slot-view';
import { SmoothUnrenderHandler } from '../../../utils/view/smooth-unrender';
import { ActivityStatusView } from '../activity-status-view';
import { NullableDateView } from '../nullable-date-view';
import { TriggerViewModel } from './trigger-view-model';

export class TriggerView implements View, OnUnrender, Disposable {
  private readonly _unrenderHandler = new SmoothUnrenderHandler(1000);

  public constructor(private readonly viewModel: TriggerViewModel) {}

  public onUnrender(unrender: () => void): void {
    this._unrenderHandler.onUnrender(unrender);
  }

  public dispose() {
    this.viewModel.dispose();
  }

  public template() {
    const actions = [
      this.viewModel.pauseAction,
      this.viewModel.resumeAction,
      new Separator(),
      this.viewModel.deleteAction,
    ];

    return (
      <div
        class="data-row data-row-trigger"
        $className={{
          executing: this.viewModel.executing,
          removing: this._unrenderHandler.removing,
        }}
      >
        <section class="primary-data">
          <div class="status" _click={this.viewModel.requestCurrentActivityDetails}>
            <Value view={ActivityStatusView} model={this.viewModel}></Value>
          </div>
          <div class="actions dropdown">
            <a href="#" class="actions-toggle dropdown-toggle" data-bs-toggle="dropdown"></a>
            <ul class="js_actions dropdown-menu">
              <List view={ActionView} model={actions}></List>
            </ul>
          </div>

          <div class="data-container">
            <a class="data-item ellipsis-link name" _click={this.viewModel.showDetails}>
              {this.viewModel.name}
            </a>
            <section class="data-item type">{this.viewModel.triggerType}</section>
            <section class="data-item startDate">
              <Value view={NullableDateView} model={this.viewModel.startDate}></Value>
            </section>
            <section class="data-item endDate">
              <Value view={NullableDateView} model={this.viewModel.endDate}></Value>
            </section>
            <section class="data-item previousFireDate">
              <Value view={NullableDateView} model={this.viewModel.previousFireDate}></Value>
            </section>
            <section class="data-item nextFireDate">
              <Value view={NullableDateView} model={this.viewModel.nextFireDate}></Value>
            </section>
          </div>
        </section>
        <section class="timeline-data js-timeline-data">
          <Value view={TimelineSlotView} model={this.viewModel.timelineSlot}></Value>
        </section>
      </div>
    );
  }
}
