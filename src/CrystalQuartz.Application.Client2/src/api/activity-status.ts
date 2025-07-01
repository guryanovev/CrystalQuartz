import { ActivityStatusCode } from './activity-status-code';

export class ActivityStatus {
  public static readonly Active = new ActivityStatus(ActivityStatusCode.Active, 'Active', 'active');
  public static readonly Paused = new ActivityStatus(ActivityStatusCode.Paused, 'Paused', 'paused');
  public static readonly Mixed = new ActivityStatus(ActivityStatusCode.Mixed, 'Mixed', 'mixed');
  public static readonly Complete = new ActivityStatus(
    ActivityStatusCode.Complete,
    'Complete',
    'complete'
  );

  private static readonly _dictionary: Record<ActivityStatusCode, ActivityStatus> = {
    0: ActivityStatus.Active,
    1: ActivityStatus.Paused,
    2: ActivityStatus.Mixed,
    3: ActivityStatus.Complete,
  };

  public constructor(
    public readonly value: number,
    public readonly title: string,
    public readonly code: string
  ) {}

  public static findBy(value: ActivityStatusCode): ActivityStatus {
    return ActivityStatus._dictionary[value];
  }
}
