import { ObservableList, ObservableValue } from 'john-smith/reactive';
import { View } from 'john-smith/view';
import { List } from 'john-smith/view/components';
import { OnUnrender } from 'john-smith/view/hooks';
import Notification from './notification';

class NotificationView implements View, OnUnrender {
  private _visible = new ObservableValue<boolean>(false);

  public constructor(private readonly notification: Notification) {}

  public onUnrender(unrender: () => void): void {
    this._visible.setValue(false);

    setTimeout(() => {
      unrender();
    }, 500);
  }

  public template() {
    setTimeout(() => {
      this._visible.setValue(true);
    }, 100);

    return (
      <li $className={{ visible: this._visible }}>
        <a
          href="#"
          _click={this.notification.forceClosing}
          _mouseenter={this.notification.disableClosing}
          _mouseleave={this.notification.enableClosing}
        >
          {this.notification.content}
        </a>
      </li>
    );
  }
}

export class NotificationsView implements View {
  public constructor(private readonly notifications: ObservableList<Notification>) {}

  public template() {
    return (
      <ul class="notifications">
        <List view={NotificationView} model={this.notifications}></List>
      </ul>
    );
  }
}
