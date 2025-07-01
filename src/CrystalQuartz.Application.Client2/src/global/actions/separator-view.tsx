import { View } from 'john-smith/view';

export default class SeparatorView implements View {
  public template = () => <li role="separator" class="divider"></li>;
}
