import Notification from './notification';
import { View } from 'john-smith/view';
import { ObservableList, ObservableValue } from 'john-smith/reactive';
import { List } from 'john-smith/view/components';

class NotificationView implements View {
    constructor(private readonly notification: Notification) {
    }

    public template() {
        const className = new ObservableValue<string>('showing');

        setTimeout(() => {
            className.setValue('');
        });

        return <li class={className}>
            <a
                href="#"
                class="js_content"
                _click={this.notification.forceClosing}
                _mouseenter={this.notification.disableClosing}
                _mouseleave={this.notification.enableClosing}>{this.notification.content}</a>
        </li>
    };

    // todo
    // init(dom: js.IDom, ) {
    //     const wire = dom.onUnrender().listen(() => {
    //         dom.$.addClass('hiding');
    //         setTimeout(() => {
    //                 dom.$.remove();
    //                 wire.dispose();
    //             },
    //             500);
    //     });
    // }
}

export class NotificationsView implements View {
    constructor(
        private readonly notifications: ObservableList<Notification>) {
    }

    template() {
        return <ul class="notifications">
            <List view={NotificationView} model={this.notifications}></List>
        </ul>;
    }
}
