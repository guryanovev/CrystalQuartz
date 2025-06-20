import { OptionalDisposables } from 'john-smith/common';
import { ObservableValue } from 'john-smith/reactive';
import { DomElement, HtmlDefinition, View } from 'john-smith/view';
import { DomEngine } from 'john-smith/view/dom-engine';
import { OnInit } from 'john-smith/view/hooks';
import { DialogManager } from './dialog-manager';

export class DialogOverlayView implements View, OnInit {
  private readonly _displayed = new ObservableValue<boolean>(false);
  private readonly _visible = new ObservableValue<boolean>(false);

  public constructor(private readonly dialogManager: DialogManager) {}

  public onInit(_: DomElement | null, __: DomEngine): OptionalDisposables {
    const escapeKeyUpListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.dialogManager.closeTopModal();
      }
    };

    window.document.addEventListener('keyup', escapeKeyUpListener);

    let timerRef: ReturnType<typeof setTimeout> | null = null;
    return [
      this.dialogManager.visibleDialogs.count().listen((dialogsCount) => {
        if (timerRef !== null) {
          clearTimeout(timerRef);
          timerRef = null;
        }

        if (dialogsCount > 0) {
          this._displayed.setValue(true);
          timerRef = setTimeout(() => {
            this._visible.setValue(true);
          }, 10);
        } else {
          this._visible.setValue(false);
          timerRef = setTimeout(() => {
            this._displayed.setValue(false);
          }, 1000);
        }
      }),
      {
        dispose: () => {
          window.document.removeEventListener('keyup', escapeKeyUpListener);
        },
      },
    ];
  }

  public template(): HtmlDefinition {
    return (
      <div
        class="dialogs-overlay js_dialogsOverlay"
        $className={{
          'dialogs-overlay__displayed': this._displayed,
          'dialogs-overlay__visible': this._visible,
        }}
      ></div>
    );
  }
}
