import { DialogManager } from './dialog-manager';

export interface IDialogConfig {
    viewModel: Function;
    view: Function;
}

export default class DialogsViewFactory
{
    createView(config: IDialogConfig[]) {
        
        return class implements js.IView<DialogManager> {
            template = 
`<div class="dialogs-overlay js_dialogsOverlay"></div>
<div class="js_dialogs"></div>`;

            init(dom: js.IDom, dialogManager: DialogManager) {
                const viewSelector = (dialog) => {
                    for (let i = 0; i < config.length; i++) {
                        if (dialog instanceof config[i].viewModel) {
                            return config[i].view;
                        }
                    }

                    throw new Error('Unknown dialog view model');
                };

                const $overlay = dom('.js_dialogsOverlay').$;

                dom('.js_dialogs').observes(dialogManager.visibleDialogs, viewSelector);

                var timerRef = null;
                dom.manager.manage(dialogManager.visibleDialogs.count().listen(visibleDialogsCount => {
                    if (timerRef) {
                        clearTimeout(timerRef);
                        timerRef = null;
                    }

                    if (visibleDialogsCount) {
                        $overlay.css('display', 'block');
                        timerRef = setTimeout(() => {
                            $overlay.css('opacity', '0.8');
                        }, 10);
                    } else {
                        $overlay.css('opacity', '0');
                        timerRef = setTimeout(() => {
                            $overlay.css('display', 'none');
                        }, 1000);
                    }
                }));

                /**
                 * Handle escape button click.
                 */
                $(document).keyup(e => {
                    if (e.keyCode === 27) {
                        dialogManager.closeTopModal();
                    }
                });
            }
        }
    }
}