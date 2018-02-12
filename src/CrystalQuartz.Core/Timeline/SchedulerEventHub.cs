using System.Collections.Concurrent;
using System.Threading;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Core.Timeline
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using CrystalQuartz.Core.Utils;

    public class SchedulerEventHub : ISchedulerEventHub, ISchedulerEventTarget
    {
        private readonly ConcurrentQueue<SchedulerEventData> _events = new ConcurrentQueue<SchedulerEventData>();

        private readonly int _maxCapacity;
        private readonly long _hubSpanMilliseconds;

        private int _previousId;

        public SchedulerEventHub(int maxCapacity, TimeSpan hubSpan)
        {
            _maxCapacity = maxCapacity;
            _hubSpanMilliseconds = (long) hubSpan.TotalMilliseconds;

            _previousId = 0;
        }

        public void Push(SchedulerEvent @event)
        {
            int id = Interlocked.Increment(ref _previousId);

            _events.Enqueue(new SchedulerEventData(id, @event, DateTime.UtcNow));

            SchedulerEventData temp;
            while (_events.Count > _maxCapacity && _events.TryDequeue(out temp))
            {
            }

            long now = DateTime.UtcNow.UnixTicks();
            while (!_events.IsEmpty && _events.TryPeek(out temp) && now - temp.Date > _hubSpanMilliseconds && _events.TryDequeue(out temp))
            {
            }
        }

        public IEnumerable<SchedulerEventData> List(int minId)
        {
            return FetchEvents(minId).ToArray();
        }

        private IEnumerable<SchedulerEventData> FetchEvents(int edgeId)
        {
            bool edgeFound = false;

            foreach (SchedulerEventData @event in _events)
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

    public class SchedulerEventData
    {
        private readonly int _id;
        private readonly SchedulerEvent _data;
        private readonly DateTime _date;

        public SchedulerEventData(int id, SchedulerEvent data, DateTime date)
        {
            _id = id;
            _data = data;
            _date = date;
        }

        public int Id
        {
            get { return _id; }
        }

        public SchedulerEvent Data
        {
            get { return _data; }
        }

        public long Date
        {
            get { return _date.UnixTicks(); }
        }
    }
}