import { OptionalDisposables } from 'john-smith/common';
import { DomElement } from 'john-smith/view';
import { List, Value } from 'john-smith/view/components';
import { DomEngine } from 'john-smith/view/dom-engine';
import { OnInit } from 'john-smith/view/hooks';
import { RENDER_PROPERTIES } from '../common/object-browser';
import { PropertyView } from '../common/property-view';
import DialogViewBase from '../dialog-view-base';
import { TriggerDetailsViewModel } from './trigger-details-view-model';

export class TriggerDetailsView extends DialogViewBase<TriggerDetailsViewModel> implements OnInit {
  public constructor(viewModel: TriggerDetailsViewModel) {
    super(viewModel, 'Trigger Details');
  }

  public onInit(root: DomElement | null, domEngine: DomEngine): OptionalDisposables {
    this.viewModel.loadDetails();

    return super.onInit(root, domEngine);
  }

  protected getBodyContent(): JSX.IElement {
    return (
      <div class="dialog-content dialog-content-no-padding">
        <Value
          view={(state) => {
            if (state === 'ready') {
              return (
                <div class="js_stateReady">
                  <div class="properties-panel">
                    <header>Identity</header>
                    <table>
                      <tbody>
                        <List view={PropertyView} model={this.viewModel.identity}></List>
                      </tbody>
                    </table>
                  </div>
                  <div class="properties-panel">
                    <header>Summary</header>
                    <table>
                      <tbody>
                        <List view={PropertyView} model={this.viewModel.summary}></List>
                      </tbody>
                    </table>
                  </div>
                  <div class="properties-panel">
                    <header>Schedule</header>
                    <table>
                      <tbody>
                        <List view={PropertyView} model={this.viewModel.schedule}></List>
                      </tbody>
                    </table>
                  </div>
                  <div class="properties-panel">
                    <header>Job Data Map</header>
                    <table class="object-browser">
                      {RENDER_PROPERTIES(this.viewModel.jobDataMap)}
                    </table>
                  </div>
                </div>
              );
            }

            if (state === 'error') {
              return (
                <div class="dialog-global-error js_stateError">{this.viewModel.errorMessage}</div>
              );
            }

            return (
              <div class="dialog-loading-message js_stateUnknown">Loading trigger details...</div>
            );
          }}
          model={this.viewModel.state}
        ></Value>
      </div>
    );
  }
}
