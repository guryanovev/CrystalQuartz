import { IDialogViewModel } from './dialog-view-model';

export interface IDialogManager {
    showModal<TResult>(viewModel: IDialogViewModel<TResult>, resultHandler: ((result: TResult) => void));
}

export class DialogManager implements IDialogManager {
    visibleDialogs = new js.ObservableList<any>();

    showModal<TResult>(viewModel: IDialogViewModel<TResult>, resultHandler: ((result: TResult) => void)) {
        console.log('show modal', viewModel);

        var wiresToDispose: js.IDisposable[] = [];

        const dispose = () => {
            for (var i = 0; i < wiresToDispose.length; i++) {
                wiresToDispose[i].dispose();
            }

            this.visibleDialogs.remove(viewModel);
        };

        const accespedWire = viewModel.accepted.listen(result => {
            resultHandler(result);
            dispose();
        });

        const canceledWire = viewModel.canceled.listen(() => {
            dispose();
        });

        wiresToDispose.push(accespedWire);
        wiresToDispose.push(canceledWire);

        this.visibleDialogs.add(viewModel);
    }
}