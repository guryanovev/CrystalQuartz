import { View } from 'john-smith/view';
import { NullableDate } from '../../api';
import DateUtils from '../../utils/date';

export class NullableDateView implements View {
  public constructor(private readonly viewModel: NullableDate) {}

  public template = () => (
    <span class="cq-date">
      {this.viewModel.isEmpty ? (
        <span class="cq-none">[none]</span>
      ) : (
        DateUtils.smartDateFormat(this.viewModel.date!) || '&nbsp;'
      )}
    </span>
  );
}
