import BootstrapperViewModel from './bootstrapper-view-model';
import BootstrapperView from './bootstrapper-view';

export default () => {
    const bootstrapperViewModel = new BootstrapperViewModel();
    new BootstrapperView().init(bootstrapperViewModel);
    bootstrapperViewModel.start();
};