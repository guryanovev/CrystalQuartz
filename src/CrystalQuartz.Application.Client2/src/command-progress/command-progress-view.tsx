import { HtmlDefinition, View } from 'john-smith/view';
import { DELAY_ON_VALUE } from '../utils/observable/delay-on-value';
import ViewModel from './command-progress-view-model';
import 'john-smith/binding/ext/className';

export default class CommandProgressView implements View {
  constructor(private readonly viewModel: ViewModel) {}

  template(): HtmlDefinition {
    const visible = DELAY_ON_VALUE(this.viewModel.active, new Map([[false, 1000]]));

    return (
      <div class="progress-indicator" $className={{ 'progress-indicator--visible': visible }}>
        <div class="loader"></div>
        <p>{this.viewModel.currentCommand}</p>
      </div>
    );
  }
}
