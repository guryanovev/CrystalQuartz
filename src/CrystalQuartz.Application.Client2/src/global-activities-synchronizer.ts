import { Job, JobGroup, SchedulerData, SchedulerEventScope, Trigger } from './api';
import Timeline from './timeline/timeline';
import { TimelineGlobalActivity } from './timeline/timeline-global-activity';
import TimelineSlot from './timeline/timeline-slot';

export default class GlobalActivitiesSynchronizer {
  private _currentData: SchedulerData | null = null;
  private _currentFlatData: { scope: number; key: string; size: number }[] | null = null;

  public constructor(private timeline: Timeline) {}

  public updateFrom(data: SchedulerData) {
    this._currentData = data;
    this._currentFlatData = null;

    const globalTimelineActivities = this.timeline.getGlobalActivities();

    if (globalTimelineActivities.length > 0) {
      this.ensureHaveFlattenData();

      for (let i = 0; i < globalTimelineActivities.length; i++) {
        this.internalUpdateActivity(globalTimelineActivities[i]);
      }
    }
  }

  public updateActivity(activity: TimelineGlobalActivity) {
    if (!this._currentData) {
      return;
    }

    this.ensureHaveFlattenData();
    this.internalUpdateActivity(activity);
  }

  public getSlotIndex(slot: TimelineSlot, reverse?: boolean) {
    this.ensureHaveFlattenData();

    const totalItems = this._currentFlatData === null ? 0 : this._currentFlatData.length;
    for (let j = 0; j < totalItems; j++) {
      const item = this._currentFlatData![j];

      if (slot.key === item.key) {
        return reverse ? totalItems - j : j;
      }
    }

    return null;
  }

  public makeSlotKey(scope: SchedulerEventScope, key: string) {
    return scope + ':' + key;
  }

  private internalUpdateActivity(activity: TimelineGlobalActivity) {
    if (activity.scope === SchedulerEventScope.Scheduler) {
      /**
       * Scheduler global activity fills the entire timeline area,
       * so we just update edges.
       */
      activity.updateVerticalPostion(0, this._currentFlatData!.length);
      return;
    }

    for (let j = 0; j < this._currentFlatData!.length; j++) {
      const item = this._currentFlatData![j];

      if (activity.scope === item.scope && activity.itemKey === item.key) {
        activity.updateVerticalPostion(j, item.size);
      }
    }
  }

  private ensureHaveFlattenData() {
    if (this._currentFlatData) {
      return;
    }

    this._currentFlatData = this._currentData!.JobGroups.flatMap((jobGroup: JobGroup) => {
      const flattenJobs = jobGroup.Jobs.flatMap((job: Job) => {
        const flattenTriggers = job.Triggers.map((t: Trigger) => ({
          scope: SchedulerEventScope.Trigger,
          key: this.makeSlotKey(SchedulerEventScope.Trigger, t.UniqueTriggerKey),
          size: 1,
        }));

        return [
          {
            scope: SchedulerEventScope.Job,
            key: this.makeSlotKey(SchedulerEventScope.Job, jobGroup.Name) + '.' + job.Name,
            size: flattenTriggers.length + 1,
          }, // todo: fix key concatenation logic
          ...flattenTriggers,
        ];
      });

      return [
        {
          scope: SchedulerEventScope.Group,
          key: this.makeSlotKey(SchedulerEventScope.Group, jobGroup.Name),
          size: flattenJobs.length + 1,
        },
        ...flattenJobs,
      ];
    });
  }
}
