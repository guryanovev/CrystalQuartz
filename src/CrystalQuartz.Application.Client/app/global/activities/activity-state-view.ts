import { ActivityState } from './activity-state';

const statusData = {};

statusData[ActivityState.InProgress] = { title: 'In progress', className: 'in-progress' };
statusData[ActivityState.Failure] = { title: 'Failed', className: 'failed' };
statusData[ActivityState.Success] = { title: 'Success', className: 'success' };

export class ActivityStateView implements js.IView<ActivityState> {
    template = 
`<span class="runnable-state">
    <span class="js_icon icon"></span>
    <span class="js_title title"></span>
</span>`   ;

    init(dom: js.IDom, viewModel: ActivityState) {
        const statusDataValue = statusData[viewModel];

        dom.root.addClass(statusDataValue.className);

        dom('.js_title').observes(statusDataValue.title);
    }
}