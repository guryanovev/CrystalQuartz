import { DialogManager } from './dialog-manager';
import { HtmlDefinition, View, ViewDefinition } from 'john-smith/view';
import { List, Value } from 'john-smith/view/components';
import { IDialogViewModel } from './dialog-view-model';

export interface IDialogConfig<T> {
    readonly viewModel: {
        new (...args: any): T
    };
    readonly view: ViewDefinition<T>;
}

export default class DialogsViewFactory
{
    createView(config: IDialogConfig<unknown>[]) {
        
        return class implements View {

            constructor(private readonly dialogManager: DialogManager) {
            }

            // todo root element
            template(): HtmlDefinition {
                const viewSelector = (dialog: IDialogViewModel<unknown>) => {
                    for (let i = 0; i < config.length; i++) {
                        if (dialog instanceof config[i].viewModel) {
                            return <Value view={config[i].view} model={dialog}></Value>;
                        }
                    }

                    throw new Error('Unknown dialog view model');
                };

                return <section>
                    <div class="dialogs-overlay js_dialogsOverlay"></div>
                    <div class="js_dialogs">
                        <List view={viewSelector} model={this.dialogManager.visibleDialogs}></List>
                    </div>
                </section>;
            }

            // init(dom: js.IDom, dialogManager: DialogManager) {

            //
            //     const $overlay = dom('.js_dialogsOverlay').$;
            //
            //     dom('.js_dialogs').observes(dialogManager.visibleDialogs, viewSelector);
            //
            //     var timerRef = null;
            //     dom.manager.manage(dialogManager.visibleDialogs.count().listen(visibleDialogsCount => {
            //         if (timerRef) {
            //             clearTimeout(timerRef);
            //             timerRef = null;
            //         }
            //
            //         if (visibleDialogsCount) {
            //             $overlay.css('display', 'block');
            //             timerRef = setTimeout(() => {
            //                 $overlay.css('opacity', '0.8');
            //             }, 10);
            //         } else {
            //             $overlay.css('opacity', '0');
            //             timerRef = setTimeout(() => {
            //                 $overlay.css('display', 'none');
            //             }, 1000);
            //         }
            //     }));
            //
            //     /**
            //      * Handle escape button click.
            //      */
            //     $(document).keyup(e => {
            //         if (e.keyCode === 27) {
            //             dialogManager.closeTopModal();
            //         }
            //     });
            // }
        }
    }
}
