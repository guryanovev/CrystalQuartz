import { OptionalDisposables } from 'john-smith/common';
import { DomElement } from 'john-smith/view';
import { List, Value } from 'john-smith/view/components';
import { DomEngine } from 'john-smith/view/dom-engine';
import { RENDER_PROPERTIES } from '../common/object-browser';
import { PropertyView } from '../common/property-view';
import DialogViewBase from '../dialog-view-base';
import ViewModel from './job-details-view-model';
import JobDetailsViewModel from './job-details-view-model';

export default class JobDetailsView extends DialogViewBase<ViewModel> {
  public constructor(viewModel: JobDetailsViewModel) {
    super(viewModel, 'Job Details');
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
                    <table class="js_identity">
                      <List view={PropertyView} model={this.viewModel.identity}></List>
                    </table>
                  </div>
                  <div class="properties-panel">
                    <header>Summary</header>
                    <table class="js_summary">
                      <List view={PropertyView} model={this.viewModel.summary}></List>
                    </table>
                  </div>
                  <div class="properties-panel">
                    <header>Job Data Map</header>
                    <table class="js_jobDataMap object-browser">
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

            return <div class="dialog-loading-message js_stateUnknown">Loading Job details...</div>;
          }}
          model={this.viewModel.state}
        ></Value>
      </div>
    );
  }
}
