namespace CrystalQuartz.Core.Services
{
    using System;
    using CrystalQuartz.Core.Domain.Base;
    using CrystalQuartz.Core.Domain.Events;
    using CrystalQuartz.Core.Services.ExceptionTraversing;

    public class EventsTransformer : IEventsTransformer
    {
        private readonly IExceptionTransformer _exceptionTransformer;

        public EventsTransformer(IExceptionTransformer exceptionTransformer)
        {
            _exceptionTransformer = exceptionTransformer;
        }

        public SchedulerEvent Transform(int id, RawSchedulerEvent rawEvent)
        {
            return new SchedulerEvent(
                id,
                DateTime.UtcNow, 
                rawEvent.Scope,
                rawEvent.EventType,
                rawEvent.ItemKey,
                rawEvent.FireInstanceId,
                rawEvent.Error != null,
                TransformError(rawEvent.Error));
        }

        private ErrorMessage[] TransformError(Exception rawEventError)
        {
            return rawEventError == null ? null : _exceptionTransformer.Transform(rawEventError);
        }
    }
}