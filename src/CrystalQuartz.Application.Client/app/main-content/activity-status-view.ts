import { ActivityStatus } from '../api';

interface IStatusAware {
    status: js.ObservableValue<ActivityStatus>;
}

export class ActivityStatusView implements js.IView<IStatusAware> {
    template =
`<span class="cq-activity-status">
    <span class="cq-activity-status-primary"></span>
    <span class="cq-activity-status-secondary"></span>
</span>`;

    init(dom: js.IDom, statusAware: IStatusAware) {
        statusAware.status.listen((newValue: ActivityStatus, oldValue?: ActivityStatus) => {
            if (oldValue) {
                dom.$.removeClass(oldValue.code);
            }

            if (newValue) {
                dom.$
                    .addClass(newValue.code)
                    .attr('title', 'Status: ' + newValue.title);
            }
        });
    }
}  