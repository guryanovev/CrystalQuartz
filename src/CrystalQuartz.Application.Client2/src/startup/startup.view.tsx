import { OptionalDisposables } from 'john-smith/common';
import { ObservableList, ObservableValue } from 'john-smith/reactive';
import { DomElement, HtmlDefinition, View } from 'john-smith/view';
import { List, Value } from 'john-smith/view/components';
import { DomEngine } from 'john-smith/view/dom-engine';
import { OnInit, OnUnrender } from 'john-smith/view/hooks';
import { Timer } from '../global/timers/timer';
import { StartupViewModel } from './startup.view-model';
import 'john-smith/view/jsx';
import { map } from 'john-smith/reactive/transformers/map';
import { DELAY_ON_VALUE } from '../utils/observable/delay-on-value';

class MessageWrapper {
  public readonly code = 'message';

  constructor(public readonly text: string) {}
}

class CountdownWrapper {
  public readonly code = 'countdown';

  constructor(public readonly retryIn: ObservableValue<string | null>) {}
}

type Message = MessageWrapper | CountdownWrapper;

class MessageView implements View, OnUnrender {
  constructor(private readonly message: Message) {}

  public template(): HtmlDefinition {
    if (this.message.code === 'message') {
      return <li>{this.message.text}</li>;
    }

    return (
      <li>
        Auto retry <span>{this.message.retryIn}</span>
      </li>
    );
  }

  public onUnrender(unrender: () => void, root: DomElement | null, domEngine: DomEngine): void {
    if (root === null) {
      unrender();
      return;
    }

    root.createClassNames().add('sliding');
    setTimeout(() => {
      unrender();
    }, 600);
  }
}

export class StartupView implements View, OnInit, OnUnrender {
  private _collapsed = new ObservableValue<boolean>(true);
  private _closing = new ObservableValue<boolean>(false);

  constructor(private readonly viewModel: StartupViewModel) {}

  public onInit(root: DomElement | null, domEngine: DomEngine): OptionalDisposables {
    setTimeout(() => {
      this._collapsed.setValue(false);
    }, 50);
  }

  public onUnrender(unrender: () => void, root: DomElement | null, domEngine: DomEngine): void {
    if (root === null) {
      unrender();
      return;
    }

    const startupViewDelay = 1000;
    const startupOverlayAnimationDuration = 1000;
    const startupSelfAnimationDuration = 1000;

    const loadingOverlay = document.getElementById('app-loading-overlay')!;

    setTimeout(
      () => {
        loadingOverlay.classList.add('app-loading-overlay--closing');
      },
      Math.max(10, startupViewDelay - startupOverlayAnimationDuration)
    );

    setTimeout(
      () => {
        this._closing.setValue(true);
      },
      Math.max(10, startupViewDelay - startupSelfAnimationDuration)
    );

    setTimeout(() => {
      unrender();
      loadingOverlay.remove();
    }, startupViewDelay);
  }

  template(): HtmlDefinition {
    const messages = new ObservableList<Message>();
    const messageHandleTimer = new Timer();

    const logoFailed = DELAY_ON_VALUE(
      this.viewModel.failed,
      new Map<boolean, number>([[true, 500]])
    );

    const messageHandler = () => {
      if (messages.currentCount() === 1 && this.viewModel.status.getValue()) {
        /**
         * Pre-loading stage is complete.
         * Application is ready for rendering.
         */

        messageHandleTimer.dispose();

        setTimeout(() => {
          // js.dom('#application').render(ApplicationView, viewModel.applicationViewModel);
          //
          this.viewModel.onAllMessagesDisplayed();
          //
          // this.fadeOut($loadingError.$);
          // this.fadeOut($overlay);
          // this.fadeOut($root);
        }, 10);
      } else {
        if (messages.currentCount() > 1) {
          const snapshot = messages.getValue();
          const top = messages.getValue()[0];
          console.log(snapshot.slice(), 'removing ' + top);
          messages.remove(top);
        }

        messageHandleTimer.schedule(messageHandler, 600);
      }
    };

    this.viewModel.statusMessage.listen((message) => {
      if (message !== null) {
        console.log(message);
        messages.add(new MessageWrapper(message));
      }
    });

    this.viewModel.failed.listen((failed) => {
      if (failed) {
        messages.add(new CountdownWrapper(this.viewModel.retryIn));
      }
    });

    const viewModel = this.viewModel;

    messageHandler();

    return (
      <section
        class="app-loading-container app-loading-container--collapsed"
        $className={{
          'app-loading-container--collapsed': this._collapsed,
          'app-loading-container--closing': this._closing,
        }}
      >
        <main>
          <div class="loading-indicator-container">
            <section class="logo" $className={{ failed: logoFailed }}>
              <span class="logo-1"></span>
              <span class="logo-2"></span>
            </section>

            <section class="app-loading-status">
              <h1>
                {map(logoFailed, (failed) => (failed ? 'Initialization error' : 'Loading...'))}
              </h1>

              <ul class="list-unstyled">
                <List view={MessageView} model={messages}></List>
              </ul>
            </section>
          </div>

          <Value
            view={() => (
              <section class="app-loading-error-container">
                <section>
                  <textarea
                    class="form-control form-control-sm"
                    _focus={() => this.viewModel.cancelAutoRetry()}
                  >
                    {this.viewModel.errorMessage}
                  </textarea>
                </section>

                <footer>
                  <button
                    class="btn btn-light"
                    disabled={map(logoFailed, (failed) => (failed ? undefined : 'disabled'))}
                    _click={() => this.viewModel.retryNow()}
                  >
                    Retry now
                  </button>
                </footer>
              </section>
            )}
            model={this.viewModel.errorMessage}
          ></Value>
        </main>
      </section>
    );
  }
}
