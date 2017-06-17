import { IDialogViewModel } from './dialog-view-model';

export default abstract class DialogViewBase<T extends IDialogViewModel<any>> implements js.IView<T>  {
    abstract template: string;

    init(dom: js.IDom, viewModel:T) {
        dom('.js_close').on('click').react(viewModel.cancel); /* todo: base class */

        dom.$.addClass('showing');
        setTimeout(() => {
            dom.$.removeClass('showing');
        }, 10);

        dom.onUnrender().listen(() => {
            dom.$.addClass('showing');
            setTimeout(() => {
                dom.$.remove();
            }, 2000);
        });
    }
}