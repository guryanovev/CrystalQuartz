import { DomElement, HtmlDefinition, View } from 'john-smith/view';
import { StartupViewModel } from './startup.view-model';
import { OnInit, OnUnrender } from 'john-smith/view/hooks';
import { OptionalDisposables } from 'john-smith/common';
import { DomEngine } from 'john-smith/view/dom-engine';
import { ObservableList, ObservableValue } from 'john-smith/reactive';
import { List } from 'john-smith/view/components';
import { Timer } from '../global/timers/timer';
import 'john-smith/view/jsx';

class MessageView implements View, OnUnrender {
    constructor(private readonly viewModel: string) {
    }

    public template(): HtmlDefinition {
        return <li>{this.viewModel}</li>
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

    constructor(private readonly viewModel: StartupViewModel) {
    }

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

        const loadingOverlay = document.getElementById('app-loading-overlay')!;
        loadingOverlay.style.opacity = '0';

        setTimeout(() => {
            unrender();
            loadingOverlay.remove();
        }, 600);
    }

    template(): HtmlDefinition {
        const messages = new ObservableList<string>();

        const messageHandleTimer = new Timer();
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
                    // viewModel.onAppRendered();
                    //
                    // this.fadeOut($loadingError.$);
                    // this.fadeOut($overlay);
                    // this.fadeOut($root);
                }, 10);
            } else {
                if (messages.currentCount() > 1) {
                    messages.remove(messages.getValue()[0]);
                }

                messageHandleTimer.schedule(messageHandler, 600);
            }
        };

        this.viewModel.statusMessage.listen(message => {
            if (message !== null) {
                messages.add(message);
            }
        });

        messageHandler();

        return <section class="app-loading-container app-loading-container--collapsed" $className={{ "app-loading-container--collapsed": this._collapsed }}>
            <main>
                <section class="logo">
                    <span class="logo-1"></span>
                    <span class="logo-2"></span>
                </section>

                <section class="app-loading-status">
                    <h1>Loading...</h1>
                    <ul class="js_loadingMessages">
                        <List view={MessageView} model={messages}></List>
                    </ul>
                </section>
            </main>
        </section>
    }
}
