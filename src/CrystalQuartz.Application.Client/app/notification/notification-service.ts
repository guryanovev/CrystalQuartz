import Notification from './notification';

export interface INotificationService {
    showError(content: string);
}

export class DefaultNotificationService implements INotificationService {
    notifications = new js.ObservableList<Notification>();

    constructor() {
        window['showError'] = m => this.showError(m);
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