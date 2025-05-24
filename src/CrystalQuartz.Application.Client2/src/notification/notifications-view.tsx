import Notification from './notification';
import { View } from 'john-smith/view';
import { ObservableList, ObservableValue } from 'john-smith/reactive';
import { List } from 'john-smith/view/components';
import { OnUnrender } from 'john-smith/view/hooks';

class NotificationView implements View, OnUnrender {
    private _visible = new ObservableValue<boolean>(false);

    constructor(private readonly notification: Notification) {
    }

    public onUnrender(unrender: () => void): void {
        this._visible.setValue(false);
        
        setTimeout(() => {
            unrender();
        }, 500);
    }

    public template() {
        
        const className = new ObservableValue<string>('');

        setTimeout(() => {
            this._visible.setValue(true);
        }, 100);

        return <li $className={{ 'visible': this._visible }}>
            <a
                href="#"
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
