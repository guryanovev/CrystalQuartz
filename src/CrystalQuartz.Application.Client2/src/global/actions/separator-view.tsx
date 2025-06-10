import { View } from 'john-smith/view';

export default class SeparatorView implements View {
  template = () => <li role="separator" class="divider"></li>;
}
