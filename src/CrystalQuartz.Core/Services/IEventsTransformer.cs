namespace CrystalQuartz.Core.Services
{
    using CrystalQuartz.Core.Domain.Events;

    public interface IEventsTransformer
    {
        /// <summary>
        /// Transforms raw event emitted by scheduler to actual scheduler
        /// instance to be stored by events hub.
        /// </summary>
        /// <param name="id">new id to assign.</param>
        /// <param name="rawEvent">emitted event.</param>
        /// <returns></returns>
        SchedulerEvent Transform(int id, RawSchedulerEvent rawEvent);
    }
}