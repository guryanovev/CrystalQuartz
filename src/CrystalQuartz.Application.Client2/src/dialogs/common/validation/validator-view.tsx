import { Listenable } from 'john-smith/reactive';
import { List } from 'john-smith/view/components';

export const ValidatorView = (viewModel: { errors: Listenable<string[]> }) => (
  <ul class="cq-validator">
    <List view={(error) => <li>{error}</li>} model={viewModel.errors}></List>
  </ul>
);
