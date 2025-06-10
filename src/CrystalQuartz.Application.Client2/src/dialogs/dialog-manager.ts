import { Disposable } from 'john-smith/common';
import { ObservableList } from 'john-smith/reactive';
import { IDialogViewModel } from './dialog-view-model';

export interface IDialogManager {
  showModal<TResult>(
    viewModel: IDialogViewModel<TResult>,
    resultHandler: (result: TResult) => void
  ): void;
}

export class DialogManager implements IDialogManager {
  visibleDialogs = new ObservableList<IDialogViewModel<any>>();

  showModal<TResult>(
    viewModel: IDialogViewModel<TResult>,
    resultHandler: (result: TResult) => void
  ) {
    while (this.visibleDialogs.getValue().length > 0) {
      // support only 1 visible dialog for now
      this.closeTopModal();
    }

    const wiresToDispose: Disposable[] = [];

    const dispose = () => {
      for (let i = 0; i < wiresToDispose.length; i++) {
        wiresToDispose[i].dispose();
      }

      this.visibleDialogs.remove(viewModel);
      console.log(this.visibleDialogs);
    };

    const accespedWire = viewModel.accepted.listen((result) => {
      resultHandler(result);
      dispose();
    });

    const canceledWire = viewModel.canceled.listen(() => {
      dispose();
    });

    wiresToDispose.push(accespedWire);
    wiresToDispose.push(canceledWire);

    this.visibleDialogs.add(viewModel);

    console.log(this.visibleDialogs);
  }

  closeTopModal() {
    const dialogs = this.visibleDialogs.getValue();

    if (dialogs.length > 0) {
      const topDialog = dialogs[dialogs.length - 1];

      topDialog.cancel();
    }
  }
}
