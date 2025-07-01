import { Tooltip } from 'bootstrap';
import { ObservableValue } from 'john-smith/reactive';
import { map } from 'john-smith/reactive/transformers/map';
import { View } from 'john-smith/view';
import { ActivityStatus } from '../../api';
import { EXTRACT_ELEMENT } from '../../utils/view/element-extractor';

interface IStatusAware {
  status: ObservableValue<ActivityStatus>;
}

export class ActivityStatusView implements View {
  public constructor(private readonly statusAware: IStatusAware) {}

  public template = () => (
    <span
      class="cq-activity-status"
      $className={map(this.statusAware.status, (status) => status.code)}
      $bind={(domElement) => {
        // Bootstrap tooltip
        const tooltip = new Tooltip(EXTRACT_ELEMENT(domElement), {
          offset: [0, 10],
          title: '...',
          placement: 'top',
        });

        const subscription = this.statusAware.status.listen((status) => {
          tooltip.setContent({ '.tooltip-inner': 'Status: ' + status.title });
        });

        return [tooltip, subscription];
      }}
    >
      <span class="cq-activity-status-primary"></span>
      <span class="cq-activity-status-secondary"></span>
    </span>
  );
}
