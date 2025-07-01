type ApplicationStatusByCode = { [key: string]: SchedulerStatus };

export class SchedulerStatus {
  public static readonly Offline = new SchedulerStatus(-1, 'Offline');
  public static readonly Empty = new SchedulerStatus(0, 'empty');
  public static readonly Ready = new SchedulerStatus(1, 'ready');
  public static readonly Started = new SchedulerStatus(2, 'started');
  public static readonly Shutdown = new SchedulerStatus(3, 'shutdown');

  private static readonly _all = [
    SchedulerStatus.Offline,
    SchedulerStatus.Empty,
    SchedulerStatus.Ready,
    SchedulerStatus.Started,
    SchedulerStatus.Shutdown,
  ];

  private static readonly _dictionaryByCode: ApplicationStatusByCode = SchedulerStatus._all.reduce(
    (result: ApplicationStatusByCode, item: SchedulerStatus) => {
      result[item.code] = item;
      return result;
    },
    {}
  );

  public constructor(
    public readonly value: number,
    public readonly code: string
  ) {}

  public static findByCode(code: string): SchedulerStatus | undefined {
    return this._dictionaryByCode[code];
  }
}
