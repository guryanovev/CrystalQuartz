import Timeline from "./timeline";
import {SchedulerEvent, SchedulerEventScope, SchedulerEventType} from "../api";
import GlobalActivitiesSynchronizer from "../global-activities-synchronizer";

export class TimelineInitializer {
    timeline: Timeline;
    globalActivitiesSynchronizer: GlobalActivitiesSynchronizer;

    constructor(timelineSizeMilliseconds: number) {
        this.timeline = new Timeline(timelineSizeMilliseconds);
        this.globalActivitiesSynchronizer = new GlobalActivitiesSynchronizer(this.timeline);
    }

    start(eventsSource: js.IEvent<SchedulerEvent>) {
        this.timeline.init();
        eventsSource.listen(event => this.handleEvent(event));
    }

    private handleEvent(event: SchedulerEvent) {
        const eventData = event.Data,
            scope = eventData.Scope,
            eventType = eventData.EventType,
            isGlobal = !(scope === SchedulerEventScope.Trigger && (eventType === SchedulerEventType.Fired || eventType === SchedulerEventType.Complete));

        if (isGlobal) {
            const
                typeCode = SchedulerEventType[eventType].toLowerCase(),
                options = {
                    occurredAt: event.Date,
                    typeCode: typeCode,
                    itemKey: this.globalActivitiesSynchronizer.makeSlotKey(scope, eventData.ItemKey),
                    scope: scope
                },
                globalActivity = this.timeline.addGlobalActivity(options);

            this.globalActivitiesSynchronizer.updateActivity(globalActivity);
        } else {
            const
                slotKey = this.globalActivitiesSynchronizer.makeSlotKey(scope, eventData.ItemKey),
                activityKey = eventData.FireInstanceId;

            if (eventType === SchedulerEventType.Fired) {
                const slot = this.timeline.findSlotBy(slotKey) || this.timeline.addSlot({ key: slotKey }),
                    existingActivity = slot.findActivityBy(activityKey);

                if (!existingActivity) {
                    this.timeline.addActivity(
                        slot,
                        {
                            key: activityKey,
                            startedAt: event.Date
                        });
                }
            } else if (eventType === SchedulerEventType.Complete) {
                const completeSlot = this.timeline.findSlotBy(slotKey);
                if (completeSlot) {
                    const activity = completeSlot.findActivityBy(activityKey);
                    if (activity) {
                        activity.complete(event.Date);
                    }
                }
            }
        }
    }
}