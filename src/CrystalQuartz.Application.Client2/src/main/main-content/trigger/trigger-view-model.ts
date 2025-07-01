import { Disposable } from 'john-smith/common';
import { ObservableValue } from 'john-smith/reactive';
import { CronTriggerType, NullableDate, SimpleTriggerType, Trigger } from '../../../api';
import { ApplicationModel } from '../../../application-model';
import {
  DeleteTriggerCommand,
  PauseTriggerCommand,
  ResumeTriggerCommand,
} from '../../../commands/trigger-commands';
import { IDialogManager } from '../../../dialogs/dialog-manager';
import { TriggerDetailsViewModel } from '../../../dialogs/trigger-details/trigger-details-view-model';
import { EventType, ISchedulerStateService } from '../../../scheduler-state-service';
import { CommandService } from '../../../services';
import Timeline from '../../../timeline/timeline';
import TimelineSlot from '../../../timeline/timeline-slot';
import { ManagableActivityViewModel } from '../activity-view-model';

interface TimespanPart {
  multiplier: number;
  pluralLabel: string;
  label: string;
}

export class TriggerViewModel extends ManagableActivityViewModel<Trigger> implements Disposable {
  private readonly _group: string;
  private readonly _realtimeWire: Disposable;

  public readonly startDate = new ObservableValue<NullableDate>(new NullableDate(null));
  public readonly endDate = new ObservableValue<NullableDate>(new NullableDate(null));
  public readonly previousFireDate = new ObservableValue<NullableDate>(new NullableDate(null));
  public readonly nextFireDate = new ObservableValue<NullableDate>(new NullableDate(null));
  public readonly triggerType = new ObservableValue<string>('');
  public readonly executing = new ObservableValue<boolean>(false);

  public readonly timelineSlot: TimelineSlot;

  public constructor(
    private readonly trigger: Trigger,
    commandService: CommandService,
    applicationModel: ApplicationModel,
    private readonly timeline: Timeline,
    private readonly dialogManager: IDialogManager,
    schedulerStateService: ISchedulerStateService
  ) {
    super(trigger, commandService, applicationModel);

    const slotKey = 3 + ':' + trigger.UniqueTriggerKey;

    this._group = trigger.GroupName;
    this.timelineSlot = timeline.findSlotBy(slotKey) || timeline.addSlot({ key: slotKey });
    this._realtimeWire = schedulerStateService.realtimeBus.listen((event) => {
      if (event.uniqueTriggerKey === trigger.UniqueTriggerKey) {
        if (event.eventType === EventType.Fired) {
          this.executing.setValue(true);
        } else {
          this.executing.setValue(false);
        }
      }
    });
  }

  public dispose() {
    this.timeline.removeSlot(this.timelineSlot);
    this._realtimeWire.dispose();
  }

  public updateFrom(trigger: Trigger) {
    super.updateFrom(trigger);

    this.startDate.setValue(new NullableDate(trigger.StartDate));
    this.endDate.setValue(new NullableDate(trigger.EndDate));
    this.previousFireDate.setValue(new NullableDate(trigger.PreviousFireDate));
    this.nextFireDate.setValue(new NullableDate(trigger.NextFireDate));

    const triggerType = trigger.TriggerType;
    let triggerTypeMessage = 'unknown';
    if (triggerType.Code === 'simple') {
      const simpleTriggerType = <SimpleTriggerType>triggerType;

      triggerTypeMessage = 'repeat ';
      if (simpleTriggerType.RepeatCount === -1) {
      } else {
        triggerTypeMessage += simpleTriggerType.RepeatCount + ' times ';
      }

      triggerTypeMessage += 'every ';

      const parts: TimespanPart[] = [
        {
          label: 'day',
          pluralLabel: 'days',
          multiplier: 1000 * 60 * 60 * 24,
        },
        {
          label: 'hour',
          pluralLabel: 'hours',
          multiplier: 1000 * 60 * 60,
        },
        {
          label: 'minute',
          pluralLabel: 'min',
          multiplier: 1000 * 60,
        },
        {
          label: 'second',
          pluralLabel: 'sec',
          multiplier: 1000,
        },
      ];

      let diff = simpleTriggerType.RepeatInterval;
      const messagesParts: string[] = [];
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const currentPartValue = Math.floor(diff / part.multiplier);
        diff -= currentPartValue * part.multiplier;

        if (currentPartValue === 1) {
          messagesParts.push(part.label);
        } else if (currentPartValue > 1) {
          messagesParts.push(currentPartValue + ' ' + part.pluralLabel);
        }
      }

      triggerTypeMessage += messagesParts.join(', ');
    } else if (triggerType.Code === 'cron') {
      const cronTriggerType = <CronTriggerType>triggerType;

      triggerTypeMessage = cronTriggerType.CronExpression;
    }

    this.triggerType.setValue(triggerTypeMessage);
  }

  public getDeleteConfirmationsText(): string {
    return 'Are you sure you want to un-schedule the trigger?';
  }

  public getPauseAction() {
    return {
      title: 'Pause trigger',
      command: () => new PauseTriggerCommand(this._group, this.name),
    };
  }

  public getResumeAction() {
    return {
      title: 'Resume trigger',
      command: () => new ResumeTriggerCommand(this._group, this.name),
    };
  }

  public getDeleteAction() {
    return {
      title: 'Delete trigger',
      command: () => new DeleteTriggerCommand(this._group, this.name),
    };
  }

  public requestCurrentActivityDetails() {
    this.timelineSlot.requestCurrentActivityDetails();
  }

  public showDetails() {
    this.dialogManager.showModal(
      new TriggerDetailsViewModel(this.trigger, this.commandService),
      () => {}
    );
  }
}
