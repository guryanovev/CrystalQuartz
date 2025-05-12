import Timeline from "./timeline";
// import {SchedulerEvent, SchedulerEventScope, SchedulerEventType} from "../api";
// import GlobalActivitiesSynchronizer from "../global-activities-synchronizer";

import { SchedulerEvent, SchedulerEventScope, SchedulerEventType } from '../api';
import { Event } from 'john-smith/reactive/event';
import GlobalActivitiesSynchronizer from '../global-activities-synchronizer';

export class TimelineInitializer {
    timeline: Timeline;
    globalActivitiesSynchronizer: GlobalActivitiesSynchronizer;

    constructor(timelineSizeMilliseconds: number) {
        this.timeline = new Timeline(timelineSizeMilliseconds);
        this.globalActivitiesSynchronizer = new GlobalActivitiesSynchronizer(this.timeline);
    }

    start(eventsSource: Event<SchedulerEvent>) {
        this.timeline.init();
        eventsSource.listen(event => this.handleEvent(event));
    }

    private handleEvent(event: SchedulerEvent) {
        const scope = event.scope;
        const eventType = event.eventType;
        const isGlobal = !(scope === SchedulerEventScope.Trigger && (eventType === SchedulerEventType.Fired || eventType === SchedulerEventType.Complete));

        if (isGlobal) {
            const typeCode = SchedulerEventType[eventType].toLowerCase();
            const options = {
                occurredAt: event.date,
                typeCode: typeCode,
                itemKey: this.globalActivitiesSynchronizer.makeSlotKey(scope, event.itemKey),
                scope: scope
            };
            const globalActivity = this.timeline.addGlobalActivity(options);

            this.globalActivitiesSynchronizer.updateActivity(globalActivity);
        } else {
            const slotKey = this.globalActivitiesSynchronizer.makeSlotKey(scope, event.itemKey);
            const activityKey = event.fireInstanceId;

            if (eventType === SchedulerEventType.Fired) {
                const slot = this.timeline.findSlotBy(slotKey) || this.timeline.addSlot({ key: slotKey });
                const existingActivity = slot.findActivityBy(activityKey);

                if (!existingActivity) {
                    this.timeline.addActivity(
                        slot,
                        {
                            key: activityKey,
                            startedAt: event.date
                        });
                }
            } else if (eventType === SchedulerEventType.Complete) {
                const completeSlot = this.timeline.findSlotBy(slotKey);
                const activity = !!completeSlot ?
                    completeSlot.findActivityBy(activityKey) :
                    (this.timeline.preservedActivity && this.timeline.preservedActivity.key === activityKey ? this.timeline.preservedActivity : null);

                if (activity) {
                    activity.complete(
                        event.date,
                        {
                            faulted: event.faulted,
                            errors: event.errors
                        });
                }
            }
        }
    }
}
