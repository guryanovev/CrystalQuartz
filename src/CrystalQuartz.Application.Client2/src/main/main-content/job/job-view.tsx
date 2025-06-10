import { Dropdown } from 'bootstrap';
import { DomElement, View } from 'john-smith/view';
import { List, Value } from 'john-smith/view/components';
import { OnUnrender } from 'john-smith/view/hooks';
import ActionView from '../../../global/actions/action-view';
import Separator from '../../../global/actions/separator';
import { SmoothUnrenderHandler } from '../../../utils/view/smooth-unrender';
import { ActivityStatusView } from '../activity-status-view';
import { TriggerView } from '../trigger/trigger-view';
import { JobViewModel } from './job-view-model';

export class JobView implements View, OnUnrender {
  private readonly _unrenderHandler = new SmoothUnrenderHandler(1000);

  constructor(private readonly viewModel: JobViewModel) {}

  public onUnrender(unrender: () => void): void {
    this._unrenderHandler.onUnrender(unrender);
  }

  template() {
    const actions = [
      this.viewModel.pauseAction,
      this.viewModel.resumeAction,
      new Separator(),
      this.viewModel.executeNowAction,
      this.viewModel.addTriggerAction,
      new Separator(),
      this.viewModel.deleteAction,
    ];

    return (
      <section
        class="job-wrapper cq-data-row-wrapper"
        $className={{ removing: this._unrenderHandler.removing }}
      >
        <div class="data-row data-row-job">
          <section class="primary-data">
            <div class="status">
              <Value view={ActivityStatusView} model={this.viewModel}></Value>
            </div>

            <div class="actions dropdown">
              <a
                href="#"
                class="actions-toggle dropdown-toggle"
                data-bs-toggle="dropdown"
                $bind={(domElement) => {
                  return new Dropdown((domElement as any).element);
                }}
              ></a>
              <ul class="js_actions dropdown-menu">
                <List view={ActionView} model={actions}></List>
              </ul>
            </div>

            <div class="data-container">
              <a
                href="#"
                class="data-item ellipsis-link js_viewDetails"
                _click={this.viewModel.loadJobDetails}
              >
                <span class="name">{this.viewModel.name}</span>
              </a>
            </div>
          </section>
          <section class="timeline-data timeline-data-filler"></section>
        </div>

        <section class="triggers">
          <List view={TriggerView} model={this.viewModel.triggers}></List>
        </section>
      </section>
    );
  }
}
