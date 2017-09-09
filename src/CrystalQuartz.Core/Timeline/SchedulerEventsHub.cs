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

                while (_events.Count > 1000)
                {
                    _events.RemoveAt(0);
                }
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