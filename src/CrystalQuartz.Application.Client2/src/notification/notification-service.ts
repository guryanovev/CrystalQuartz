import { ObservableList } from 'john-smith/reactive';
import Notification from './notification';

export interface INotificationService {
  showError(content: string): void;
}

export class DefaultNotificationService implements INotificationService {
  notifications = new ObservableList<Notification>();

  constructor() {
    (window as any)['showError'] = (m: string) => this.showError(m); // todo is it for testing?
  }

  showError(content: string) {
    const notification = new Notification(content);

    const toDispose = notification.outdated.listen(() => {
      this.hide(notification);
      toDispose.dispose();
    });

    this.notifications.add(notification);
  }

  private hide(notification: Notification) {
    this.notifications.remove(notification);
  }
}
