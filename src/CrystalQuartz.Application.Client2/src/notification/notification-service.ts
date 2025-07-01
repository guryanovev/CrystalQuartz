import { ObservableList } from 'john-smith/reactive';
import Notification from './notification';

export interface INotificationService {
  showError(content: string): void;
}

export class DefaultNotificationService implements INotificationService {
  public readonly notifications = new ObservableList<Notification>();

  public constructor() {
    (window as { showError?: (message: string) => void }).showError = (m: string) =>
      this.showError(m); // for testing
  }

  public showError(content: string) {
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
