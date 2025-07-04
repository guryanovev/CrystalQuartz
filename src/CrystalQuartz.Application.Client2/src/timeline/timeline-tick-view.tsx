﻿import { View } from 'john-smith/view';
import DateUtils from '../utils/date';
import { ITimelineTickItem } from './common';

export default class TimelineTickView implements View {
  public constructor(private readonly viewModel: ITimelineTickItem) {}

  public template() {
    return (
      <li class="timeline-tick" style={'width: ' + this.viewModel.width + '%'}>
        <span>{this.formatDate(new Date(this.viewModel.tickDate))}</span>
      </li>
    );
  }

  private formatDate(date: number | Date) {
    return DateUtils.timeFormat(date);
  }
}
