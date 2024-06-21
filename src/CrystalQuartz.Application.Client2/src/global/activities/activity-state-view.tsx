import { ActivityState } from './activity-state';
import { HtmlDefinition, View } from 'john-smith/view';

const statusData: Record<ActivityState, { title: string; className: string }> = {
    [ActivityState.InProgress]: { title: 'In progress', className: 'in-progress' },
    [ActivityState.Failure]: { title: 'Failed', className: 'failed' },
    [ActivityState.Success]: { title: 'Success', className: 'success' }
};

export class ActivityStateView implements View {

    constructor(
        private readonly viewModel: ActivityState
    ) {
    }

    template(): HtmlDefinition {
        const statusDataValue = statusData[this.viewModel];

        return <span class="runnable-state" $className={statusDataValue.className}>
                <span class="js_icon icon"></span>
                <span class="js_title title">{statusDataValue.title}</span>
            </span>;
    }
}
