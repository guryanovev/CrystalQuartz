import Separator from './separator';
import Action from './action';

import SeparatorView from './separator-view';
import ActionView from './action-view';

export default class ActionsUtils {
    static render(dom: js.IListenerDom, actions: [Separator|Action]) {
        dom.observes(
            actions,
            item => item instanceof Separator ? SeparatorView : ActionView);
    }
}