import ViewModel from './bootstrapper-view-model';
import ApplicationView from '../application-view';

export default class BootstrapperView {
    init(viewModel:ViewModel) {
        js.dom('.js_loadingMessage').observes(viewModel.statusMessage);

        viewModel.status.listen(isReady => {
            if (isReady) {
                js.dom('#application').render(ApplicationView, viewModel.applicationViewModel);
            }
        });
    }
}