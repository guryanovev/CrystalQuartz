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

            template(): HtmlDefinition {
                const viewSelector = (dialog: IDialogViewModel<unknown>) => {
                    for (let i = 0; i < config.length; i++) {
                        if (dialog instanceof config[i].viewModel) {
                            return <Value view={config[i].view} model={dialog}></Value>;
                        }
                    }

                    throw new Error('Unknown dialog view model');
                };

                return <div class="js_dialogs">
                        <List view={viewSelector} model={this.dialogManager.visibleDialogs}></List>
                    </div>;
            }
        }
    }
}
