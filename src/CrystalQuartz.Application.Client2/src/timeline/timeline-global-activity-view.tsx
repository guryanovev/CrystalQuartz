import { combine } from 'john-smith/reactive/transformers/combine';
import { View } from 'john-smith/view';
import TimelineActivity from './timeline-activity';
import { TimelineGlobalActivity } from './timeline-global-activity';

export default class TimelineGlobalActivityView implements View {
  private _activity: TimelineGlobalActivity;

  constructor(activity: TimelineActivity) {
    this._activity = activity as TimelineGlobalActivity; // todo avoid cast
  }

  template = () => {
    const style = combine(
      this._activity.position,
      this._activity.verticalPosition,
      (position, verticalPosition) => {
        let result = '';

        if (position !== null) {
          result += 'left: ' + position.left + '%; ';
        }

        if (verticalPosition !== null) {
          result += 'top: ' + verticalPosition.top * 20 + 'px; ';
          result += 'height: ' + verticalPosition.height * 20 + 'px; ';
        }

        return result;
      }
    );

    return (
      <div class="timeline-global-item" $className={this._activity.typeCode} style={style}>
        <span
          class="timeline-marker-pick"
          _mouseenter={this._activity.requestSelection}
          _mouseleave={this._activity.requestDeselection}
        ></span>
        <span
          class="timeline-marker-arrow"
          _mouseenter={this._activity.requestSelection}
          _mouseleave={this._activity.requestDeselection}
        ></span>
        <span
          class="timeline-marker-body"
          _mouseenter={this._activity.requestSelection}
          _mouseleave={this._activity.requestDeselection}
        ></span>
      </div>
    );
  };
}
