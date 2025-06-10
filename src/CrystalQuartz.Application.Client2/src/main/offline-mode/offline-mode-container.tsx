import { Listenable } from 'john-smith/reactive';
import { Value } from 'john-smith/view/components/value';
import { OfflineModeView } from './offline-mode-view';
import { OfflineModeViewModel } from './offline-mode-view-model';

export type OfflineModeContainerModel = {
  offlineMode: Listenable<OfflineModeViewModel | null>;
};

export const OfflineModeContainerView = (viewModel: OfflineModeContainerModel) => (
  <Value view={OfflineModeView} model={viewModel.offlineMode}></Value>
);
