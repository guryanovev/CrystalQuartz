import Action from './action';

export default class ActionView implements js.IView<Action> {
    template = '<li><a href="#"></a></li>';

    init(dom: js.IDom, action: Action) {
        const container = dom('li');
        const link = dom('a');

        dom('li').className('disabled').observes(action.disabled);

        link.observes(action.title);
        link.on('click').react(() => {
            if (!container.$.is('.disabled')) {
                action.execute();
            }
        });
    }
}