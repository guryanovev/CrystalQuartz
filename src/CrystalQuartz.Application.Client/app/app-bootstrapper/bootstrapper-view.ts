import ViewModel from './bootstrapper-view-model';
import ApplicationView from '../application-view';

export default class BootstrapperView {
    init(viewModel: ViewModel) {
        /**
         * This is not actually a view as we do some connections to existing
         * app loading UI. So we use low-level jquery methods to do rendering
         * here.
         */

        const $root = js.dom('.js_appLoading').$,
              $overlay = js.dom('.js_appLoadingOverlay').$,
              $messages = $root.find('.js_loadingMessages');

        const messages = [];
        const timerRef = setInterval(() => {
            if (messages.length > 0) {
                const currentMessage = messages.splice(0, 1)[0];
                $messages.find('li').addClass('sliding');
                $messages.append('<li>' + currentMessage + '</li>');
            } else if (viewModel.status.getValue()) {
                clearTimeout(timerRef);
                this.fadeOut($root);
            }
        }, 600);

        viewModel.statusMessage.listen(message => {
            if (message) {
                messages.push(message);
            }
        });

        viewModel.status.listen(isReady => {
            if (isReady) {
                js.dom('#application').render(ApplicationView, viewModel.applicationViewModel);

                this.fadeOut($overlay);
            }
        });
    }

    private fadeOut($target: JQuery) {
        $target.css('opacity', 0);
        setTimeout(() => $target.remove(), 1000);
    }
}