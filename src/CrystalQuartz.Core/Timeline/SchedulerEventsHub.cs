namespace CrystalQuartz.Core.Timeline
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using CrystalQuartz.Core.Utils;

    public class SchedulerEventsHub
    {
        private readonly object _lockRef = new Object();

        private int _maxId = 1;
        private readonly IList<SchedulerEventData> _events = new List<SchedulerEventData>();

        public void Push(SchedulerEvent @event)
        {
            lock (_lockRef)
            {
                _events.Add(new SchedulerEventData(_maxId++, @event, DateTime.UtcNow));
            }
        }

        public IEnumerable<SchedulerEventData> List(int minId)
        {
            return _events.Where(x => x.Id > minId);
        }
    }

    public class SchedulerEventData
    {
        private readonly int _id;
        private readonly SchedulerEvent _event;
        private readonly DateTime _date;

        public SchedulerEventData(int id, SchedulerEvent @event, DateTime date)
        {
            _id = id;
            _event = @event;
            _date = date;
        }

        public int Id
        {
            get { return _id; }
        }

        public SchedulerEvent Event
        {
            get { return _event; }
        }

        public long Date
        {
            get { return _date.UnixTicks(); }
        }
    }
}