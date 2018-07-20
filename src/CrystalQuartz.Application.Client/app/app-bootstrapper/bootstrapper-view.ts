import ViewModel, {FaviconStatus} from './bootstrapper-view-model';
import ApplicationView from '../application-view';
import {Timer} from "../global/timer";
import {FaviconRenderer} from "./favicon-renderer";

export default class BootstrapperView {
    init(viewModel: ViewModel) {
        /**
         * This is not actually a view as we do some connections to existing
         * app loading UI. So we use low-level jquery methods to do rendering
         * here.
         */

        const $root = js.dom('.js_appLoading').$,
              $overlay = js.dom('.js_appLoadingOverlay').$,
              $messages = $root.find('.js_loadingMessages'),
              $loadingError = js.dom('.js_appLoadingError'),
              $loadingErrorMessage = js.dom('.js_appLoadingErrorMessage'),
              $retryIn = js.dom('.js_retryIn'),
              $retryNow = js.dom('.js_retryNow');

        $loadingErrorMessage.observes(viewModel.errorMessage);
        $retryIn.observes(viewModel.retryIn);

        $loadingErrorMessage.on('focusin').react(() => viewModel.cancelAutoRetry());
        $retryNow.on('click').react(() => viewModel.retryNow());

        const
            messages = [],
            messageHandleTimer = new Timer(),
            messageHandler = () => {
                if (messages.length === 0 && viewModel.status.getValue()) {
                    /**
                     * Pre-loading stage is complete.
                     * Application is ready for rendering.
                     */

                    messageHandleTimer.dispose();

                    setTimeout(() => {
                        js.dom('#application').render(ApplicationView, viewModel.applicationViewModel);

                        viewModel.onAppRendered();

                        this.fadeOut($loadingError.$);
                        this.fadeOut($overlay);
                        this.fadeOut($root);
                    }, 10);
                } else {
                    if (messages.length > 0) {
                        const currentMessage = messages.splice(0, 1)[0];
                        $messages.find('li').addClass('sliding');
                        $messages.append('<li>' + currentMessage + '</li>');
                    }

                    messageHandleTimer.schedule(messageHandler, 600);
                }
            };

        /**
         * Initiate messages pulling cycle.
         */
        messageHandler();

        viewModel.customStylesUrl.listen(url => {
            const fileref = $("<link/>");

            fileref.attr("rel", "stylesheet");
            fileref.attr("type", "text/css");
            fileref.attr("href", url);

            $root.closest('html').find('head').append(fileref);    
        });

        viewModel.statusMessage.listen(message => {
            if (message) {
                messages.push(message);
            }
        });

        viewModel.failed.listen(failed => {
            if (failed) {
                $loadingError.$.show();
                $loadingError.$.css('opacity', '1');
                $root.hide();
            } else {
                $loadingError.$.css('opacity', '0.3');
                $root.show();
            }
        });

        const faviconRenderer = new FaviconRenderer();
        viewModel.favicon.listen((faviconStatus:FaviconStatus, oldFaviconStatus: FaviconStatus) => {
            if (faviconStatus !== null && faviconStatus !== undefined && faviconStatus !== oldFaviconStatus) {
                faviconRenderer.render(faviconStatus);
            }
        });

        viewModel.title.listen(title => {
            if (title) {
                document.title = title;
            }
        });
    }

    private fadeOut($target: JQuery) {
        $target.css( 'opacity', 0);
        setTimeout(() => $target.remove(), 1000);
    }
}