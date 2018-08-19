namespace CrystalQuartz.Core.Services
{
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Domain.Events;
    using CrystalQuartz.Core.Utils;

    public class SchedulerEventHub : ISchedulerEventHub, ISchedulerEventTarget
    {
        private readonly ConcurrentQueue<SchedulerEvent> _events = new ConcurrentQueue<SchedulerEvent>();

        private readonly int _maxCapacity;
        private readonly long _hubSpanMilliseconds;
        private readonly IEventsTransformer _eventsTransformer;

        private int _previousId;

        public SchedulerEventHub(int maxCapacity, TimeSpan hubSpan, IEventsTransformer eventsTransformer)
        {
            _maxCapacity = maxCapacity;
            _eventsTransformer = eventsTransformer;
            _hubSpanMilliseconds = (long) hubSpan.TotalMilliseconds;

            _previousId = 0;
        }

        public void Push(RawSchedulerEvent @event)
        {
            int id = Interlocked.Increment(ref _previousId);

            _events.Enqueue(_eventsTransformer.Transform(id, @event));
            //_events.Enqueue(new SchedulerEventData(id, @event, DateTime.UtcNow));

            SchedulerEvent temp;
            while (_events.Count > _maxCapacity && _events.TryDequeue(out temp))
            {
            }

            long now = DateTime.UtcNow.UnixTicks();
            while (!_events.IsEmpty && _events.TryPeek(out temp) && now - temp.Date > _hubSpanMilliseconds && _events.TryDequeue(out temp))
            {
            }
        }

        public IEnumerable<SchedulerEvent> List(int minId)
        {
            return FetchEvents(minId).ToArray();
        }

        private IEnumerable<SchedulerEvent> FetchEvents(int edgeId)
        {
            bool edgeFound = false;

            foreach (SchedulerEvent @event in _events)
            {
                if (edgeFound)
                {
                    yield return @event;
                } else if (@event.Id == edgeId)
                {
                    edgeFound = true;
                }
            }

            if (!edgeFound)
            {
                foreach (var @event in _events)
                {
                    yield return @event;
                }
            }
        }
    }
}