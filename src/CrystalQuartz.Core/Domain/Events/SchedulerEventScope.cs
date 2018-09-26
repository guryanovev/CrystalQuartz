namespace CrystalQuartz.Core.Domain.Events
{
    public enum SchedulerEventScope : short
    {
        Scheduler = 0,
        Group = 1,
        Job = 2,
        Trigger = 3
    }
}