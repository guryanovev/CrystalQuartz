import { OptionalDisposables } from 'john-smith/common';
import { ObservableValue } from 'john-smith/reactive';
import { map } from 'john-smith/reactive/transformers/map';
import { DomElement, HtmlDefinition, View } from 'john-smith/view';
import { DomEngine } from 'john-smith/view/dom-engine';
import { OnInit, OnUnrender } from 'john-smith/view/hooks';
import { OfflineModeViewModel } from './offline-mode-view-model';

export class OfflineModeView implements View, OnInit, OnUnrender {
  private readonly _visible = new ObservableValue<boolean>(false);

  constructor(private readonly viewModel: OfflineModeViewModel) {}

  public onInit(root: DomElement | null, domEngine: DomEngine): OptionalDisposables {
    this.viewModel.init();
    setTimeout(() => {
      this._visible.setValue(true);
    }, 100);
  }

  public onUnrender(unrender: () => void, root: DomElement | null, domEngine: DomEngine): void {
    this._visible.setValue(false);
    setTimeout(() => {
      unrender();
    }, 1000);
  }

  public template(): HtmlDefinition {
    return (
      <section
        class="offline-mode d-flex flex-row align-items-center justify-content-center"
        $className={{ visible: this._visible }}
      >
        <div class="offline-mode-overlay"></div>
        <div class="offline-mode-container">
          <section class="offline-mode-body d-flex flex-column">
            <h1>
              Server is offline since <span>{this.viewModel.since}</span>
            </h1>

            <p class="flex-fill">
              Please make sure the server application at
              <span class="js_address">{this.viewModel.serverUrl}</span> is up and running.
            </p>

            <footer class="d-flex justify-content-between">
              <span>
                Retry <span class="js_retryIn">{this.viewModel.retryIn}</span>
              </span>

              <button
                href="javascript:void(0)"
                class="btn btn-light"
                disabled={map(this.viewModel.isInProgress, (inProgress) =>
                  inProgress ? 'disabled' : undefined
                )}
                _click={() => this.viewModel.retryNow()}
              >
                Retry now
              </button>
            </footer>
          </section>
        </div>
      </section>
    );
  }

  // init(dom: js.IDom, viewModel: OfflineModeViewModel) {
  //     setTimeout(() => dom.root.$.addClass('visible'), 100);
  //
  //     dom('.js_since').observes(viewModel.since);
  //     dom('.js_address').observes(viewModel.serverUrl);
  //     dom('.js_retryIn').observes(viewModel.retryIn);
  //
  //     const
  //         $retryNow = dom('.js_retryNow');
  //
  //     $retryNow.on('click').react(viewModel.retryNow);
  //     $retryNow.className('disabled').observes(viewModel.isInProgress);
  // }
}
