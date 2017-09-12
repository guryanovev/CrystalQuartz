import { SchedulerData, SchedulerEventScope } from './api';

import Timeline from './timeline/timeline';
import { TimelineGlobalActivity } from './timeline/timeline-global-activity';
import TimelineSlot from './timeline/timeline-slot';

import __map from 'lodash/map';
import __flatMap from 'lodash/flatMap';
import __sumBy from 'lodash/sumBy';

export default class GlobalActivitiesSynchronizer {
    private _currentData: SchedulerData;
    private _currentFlatData: { scope: number, key: string, size: number }[];

    constructor(private timeline: Timeline) {
    }

    updateFrom(data: SchedulerData) {
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

    updateActivity(activity: TimelineGlobalActivity) {
        if (!this._currentData) {
            return;
        }

        this.ensureHaveFlattenData();
        this.internalUpdateActivity(activity);
    }

    getSlotIndex(slot: TimelineSlot, reverse?: boolean) {
        this.ensureHaveFlattenData();

        const totalItems = this._currentFlatData.length;
        for (let j = 0; j < totalItems; j++) {
            const item = this._currentFlatData[j];

            if (slot.key === item.key) {
                return reverse ? totalItems - j : j;
            }
        }

        return null;
    }

    private internalUpdateActivity(activity: TimelineGlobalActivity) {
        if (activity.scope === SchedulerEventScope.Scheduler) {
            activity.updateVerticalPostion(0, this._currentFlatData.length);
            return;
        }

        for (let j = 0; j < this._currentFlatData.length; j++) {
            const item = this._currentFlatData[j];

            if (activity.scope === item.scope && activity.itemKey === item.key) {
                activity.updateVerticalPostion(j, item.size);
            }
        }
    }

    private ensureHaveFlattenData() {
        if (this._currentFlatData) {
            return;
        }

        this._currentFlatData = __flatMap(
            this._currentData.JobGroups,
            jobGroup => {
                const flattenJobs = __flatMap(
                    jobGroup.Jobs,
                    job => {
                        const flattenTriggers = __map(job.Triggers,
                            t => ({ scope: 3, key: t.UniqueTriggerKey, size: 1 }));

                        return [
                            { scope: 2, key: jobGroup.Name + '.' + job.Name, size: flattenTriggers.length + 1 },
                            ...flattenTriggers
                        ];
                    }
                );

                return [
                    { scope: 1, key: jobGroup.Name, size: flattenJobs.length + 1 },
                    ...flattenJobs
                ];
            });
    }
    
}