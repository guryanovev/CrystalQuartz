import { Disposable, OptionalDisposables } from 'john-smith/common';
import { DomElement } from 'john-smith/view';
import { Value } from 'john-smith/view/components/value';
import { DomEngine } from 'john-smith/view/dom-engine';
import { ActivityStateView } from '../../global/activities/activity-state-view';
import { NullableDateView } from '../../main/main-content/nullable-date-view';
import { ErrorsView } from '../common/errors-view';
import DialogViewBase from '../dialog-view-base';
import ActivityDetailsViewModel from './activity-details-view-model';

export default class ActivityDetailsView
  extends DialogViewBase<ActivityDetailsViewModel>
  implements Disposable
{
  constructor(viewModel: ActivityDetailsViewModel) {
    super(viewModel, 'Trigger fire info');
  }

  public onInit(root: DomElement | null, domEngine: DomEngine): OptionalDisposables {
    this.viewModel.loadDetails();

    return super.onInit(root, domEngine);
  }

  public dispose() {
    this.viewModel.dispose();
  }

  protected getBodyContent(): JSX.IElement {
    const activityModel = this.viewModel.activityModel;
    const duration = activityModel.duration;

    return (
      <div class="dialog-content dialog-content-no-padding">
        <div class="properties-panel">
          <header>Summary</header>
          <table>
            <tr>
              <td>Fire status</td>
              <td>
                <Value view={ActivityStateView} model={activityModel.status}></Value>
              </td>
            </tr>
            <tr>
              <td>Trigger started at</td>
              <td>
                <Value view={NullableDateView} model={activityModel.startedAt}></Value>
              </td>
            </tr>
            <tr>
              <td>Trigger completed at</td>
              <td>
                <Value view={NullableDateView} model={activityModel.completedAt}></Value>
              </td>
            </tr>
            <tr>
              <td>Duration</td>
              <td>
                <span class="js_durationValue">{duration.value}</span>
                <span class="js_durationUnit">{duration.measurementUnit}</span>
              </td>
            </tr>
            <tr>
              <td>Fire instance ID</td>
              <td class="js_fireInstanceId">{this.viewModel.fireInstanceId}</td>
            </tr>
          </table>
        </div>

        <section>
          <Value view={ErrorsView} model={activityModel.errors}></Value>
        </section>
      </div>
    );
  }
}
