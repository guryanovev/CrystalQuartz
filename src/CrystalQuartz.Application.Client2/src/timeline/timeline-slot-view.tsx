import { OptionalDisposables } from 'john-smith/common';
import { ObservableValue } from 'john-smith/reactive';
import { map } from 'john-smith/reactive/transformers/map';
import { View } from 'john-smith/view';
import { List } from 'john-smith/view/components';
import { OnInit } from 'john-smith/view/hooks';
import TimelineActivity from './timeline-activity';
import TimelineSlot from './timeline-slot';

class TimelineActivityView implements View, OnInit {
  private readonly _faulted = new ObservableValue<boolean>(this.activity.faulted);

  public constructor(private readonly activity: TimelineActivity) {}

  public onInit(): OptionalDisposables {
    return [
      this.activity.completed.listen(() => {
        this._faulted.setValue(this.activity.faulted);
      }),
    ];
  }

  public template() {
    const style = map(this.activity.position, (position) => {
      if (position === null) {
        return '';
      }

      return 'left: ' + position.left + '%; width: ' + position.width + '%;';
    });

    return (
      <div
        class="timeline-item"
        $className={{
          ['key-' + this.activity.key]: true,
          faulted: this._faulted,
        }}
        style={style}
        _mouseenter={this.activity.requestSelection}
        _mouseleave={this.activity.requestDeselection}
        _click={this.activity.requestDetails}
      ></div>
    );
  }
}

export const TimelineSlotView = (slot: TimelineSlot) => (
  <div class="timeline-slot">
    <section class="timeline-slot-activities">
      <List view={TimelineActivityView} model={slot.activities}></List>
    </section>
  </div>
);
