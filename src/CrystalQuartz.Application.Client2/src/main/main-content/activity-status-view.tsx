import { ActivityStatus } from '../../api';
import { View } from 'john-smith/view';
import { ObservableValue } from 'john-smith/reactive';
import { map } from 'john-smith/reactive/transformers/map';

interface IStatusAware {
    status: ObservableValue<ActivityStatus>;
}

export class ActivityStatusView implements View {

    constructor(
        private readonly statusAware: IStatusAware
    ) {
    }

    template = () =>
<span class="cq-activity-status" title={map(this.statusAware.status, status => 'Status: ' + status)} $className={map(this.statusAware.status, status => status.code)}>
    <span class="cq-activity-status-primary"></span>
    <span class="cq-activity-status-secondary"></span>
</span>;
}
