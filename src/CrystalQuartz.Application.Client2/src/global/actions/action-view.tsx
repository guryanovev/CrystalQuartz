import Action from './action';
import { HtmlDefinition, View } from 'john-smith/view';
import Separator from './separator';

export default class ActionView implements View {
    constructor(private readonly action: Action | Separator) {
    }

    template(): HtmlDefinition {
        const action = this.action;
        if (action instanceof Separator) {
            return <li role="separator" class="divider"></li>;
        } else {
            return <li $className={{ 'disabled': action.disabled, 'danger': action.isDanger }}>
                <a href="#" _click={() => {
                    if (!action.disabled.getValue()) {
                        action.execute();
                    }
                }}><span>{action.title}</span></a>
            </li>;
        }
    }

    // init(dom: js.IDom, action: Action) {
    //     const container = dom('li');
    //     const link = dom('a');
    //
    //     dom('li').className('disabled').observes(action.disabled);
    //
    //     dom('span').observes(action.title);
    //
    //     if (action.isDanger) {
    //         //link.$.prepend('<span class="danger">!</span>');
    //         container.$.addClass('danger');
    //     }
    //
    //     link.on('click').react(() => {
    //         if (!container.$.is('.disabled')) {
    //             action.execute();
    //         }
    //     });
    // }
}
