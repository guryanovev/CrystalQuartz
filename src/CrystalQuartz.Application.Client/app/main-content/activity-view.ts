import { ManagableActivity } from '../api';
import { ManagableActivityViewModel } from './activity-view-model';
import { ActivityStatusView } from './activity-status-view';

import Action from '../global/actions/action';
import Separator from '../global/actions/separator';
import ActionUtils from '../global/actions/actions-utils';

export abstract class ActivityView<T extends ManagableActivityViewModel<any>> implements js.IView<T> {
    template = ''; // abstract

    abstract composeActions(viewModel: T): (Action|Separator)[];

    init(dom: js.IDom, viewModel: T) {
        dom('.name').observes(viewModel.name);
        dom('.status').observes(viewModel, ActivityStatusView);

        ActionUtils.render(dom('.js_actions'), this.composeActions(viewModel));
    }
}   