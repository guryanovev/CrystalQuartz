namespace CrystalQuartz.Core.Services
{
    using System;
    using CrystalQuartz.Core.Domain.Base;
    using CrystalQuartz.Core.Domain.Events;
    using CrystalQuartz.Core.Services.ExceptionTraversing;

    public class EventsTransformer
    {
        private readonly IExceptionTransformer _exceptionTransformer;

        public EventsTransformer(IExceptionTransformer exceptionTransformer)
        {
            _exceptionTransformer = exceptionTransformer;
        }

        /// <summary>
        /// Transforms raw event emitted by scheduler to actual scheduler
        /// instance to be stored by events hub.
        /// </summary>
        /// <param name="rawEvent"></param>
        /// <returns></returns>
        public SchedulerEvent Transform(RawSchedulerEvent rawEvent)
        {
            return new SchedulerEvent(
                rawEvent.Scope,
                rawEvent.EventType,
                rawEvent.ItemKey,
                rawEvent.FireInstanceId,
                TransformError(rawEvent.Error),
                rawEvent.Error != null);
        }

        private ErrorMessage[] TransformError(Exception rawEventError)
        {
            return rawEventError == null ? null : _exceptionTransformer.Transform(rawEventError);
        }
    }
}