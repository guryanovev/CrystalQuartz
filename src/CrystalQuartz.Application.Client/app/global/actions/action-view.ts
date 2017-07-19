import Action from './action';

export default class ActionView implements js.IView<Action> {
    template = '<li><a href="#"><span></span></a></li>';

    init(dom: js.IDom, action: Action) {
        const container = dom('li');
        const link = dom('a');

        

        dom('li').className('disabled').observes(action.disabled);

        dom('span').observes(action.title);

        if (action.isDanger) {
            //link.$.prepend('<span class="danger">!</span>');
            container.$.addClass('danger');
        }

        link.on('click').react(() => {
            if (!container.$.is('.disabled')) {
                action.execute();
            }
        });
    }
}