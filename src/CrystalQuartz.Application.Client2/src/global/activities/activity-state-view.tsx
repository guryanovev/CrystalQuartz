import { HtmlDefinition, View } from 'john-smith/view';
import { ActivityState } from './activity-state';

const statusData: Record<ActivityState, { title: string; className: string }> = {
  [ActivityState.InProgress]: { title: 'In progress', className: 'in-progress' },
  [ActivityState.Failure]: { title: 'Failed', className: 'failed' },
  [ActivityState.Success]: { title: 'Success', className: 'success' },
};

export class ActivityStateView implements View {
  public constructor(private readonly viewModel: ActivityState) {}

  public template(): HtmlDefinition {
    const statusDataValue = statusData[this.viewModel];

    return (
      <span class="runnable-state" $className={statusDataValue.className}>
        <span class="icon"></span>
        <span class="title">{statusDataValue.title}</span>
      </span>
    );
  }
}
