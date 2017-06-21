import Notification from './notification';

class NotificationView implements js.IView<Notification> {
    template = `
<li class="showing">
    <a href="#" class="js_content"></a>
</li>`;

    init(dom: js.IDom, notification: Notification) {
        const $content = dom('.js_content');

        $content.observes(notification.content);

        $content.on('click').react(notification.forceClosing);
        $content.on('mouseenter').react(notification.disableClosing);
        $content.on('mouseleave').react(notification.enableClosing);
        
        setTimeout(() => {
            dom.$.removeClass('showing');
        });

        const wire = dom.onUnrender().listen(() => {
            dom.$.addClass('hiding');
            setTimeout(() => {
                    dom.$.remove();
                    wire.dispose();
                },
                500);
        });
    }
}

export default class NotificationsView implements js.IView<js.ObservableList<Notification>> {
    template = `<ul class="notifications"></ul>`;

    init(dom: js.IDom, notifications: js.ObservableList<Notification>) {
        dom('ul').observes(notifications, NotificationView);
    }
}