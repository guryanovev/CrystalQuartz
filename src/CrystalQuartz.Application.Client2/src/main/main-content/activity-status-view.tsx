import { ActivityStatus } from '../../api';
import { View } from 'john-smith/view';
import { ObservableValue } from 'john-smith/reactive';
import { map } from 'john-smith/reactive/transformers/map';

import { Tooltip } from 'bootstrap';

interface IStatusAware {
    status: ObservableValue<ActivityStatus>;
}

export class ActivityStatusView implements View {

    constructor(
        private readonly statusAware: IStatusAware
    ) {
    }

    template = () =>
<span
    class="cq-activity-status"
    data-bs-toggle="tooltip"
    data-bs-placement="top"
    data-bs-title={'Status: ' + this.statusAware.status.getValue().title}
    $className={map(this.statusAware.status, status => status.code)}
    $bind={(domElement) => {
        const tooltip = new Tooltip((domElement as any).element, { offset: [0, 10] });
        //
        // const subscription = this.statusAware.status.listen(status => {
        //     tooltip.setContent({ '.tooltip-inner': 'Status: ' + status.title });
        // });
        //
        // return [tooltip, subscription];
    }}>

    <span class="cq-activity-status-primary"></span>
    <span class="cq-activity-status-secondary"></span>
</span>;
}
