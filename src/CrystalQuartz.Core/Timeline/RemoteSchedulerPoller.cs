namespace CrystalQuartz.Core.Timeline
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Reflection.Emit;
    using System.Runtime.Remoting;
    using System.Runtime.Remoting.Channels;
    using System.Runtime.Remoting.Services;
    using System.Runtime.Serialization;
    using System.Runtime.Serialization.Formatters.Binary;
    using System.Threading;
    using Quartz;

    public class RemoteSchedulerPoller : IDisposable
    {
        private readonly TimeSpan _pollingInterval;
        private readonly IScheduler _scheduler;
        private readonly SchedulerEventsHub _eventsHub;

        private readonly List<RuntimeTriggerData> _workingNow = new List<RuntimeTriggerData>();

        private bool _disposed = false;

        public RemoteSchedulerPoller(TimeSpan pollingInterval, IScheduler scheduler, SchedulerEventsHub eventsHub)
        {
            _pollingInterval = pollingInterval;
            _scheduler = scheduler;
            _eventsHub = eventsHub;
        }

        public void Start()
        {
            //FormatterServices.
            AppDomain.CurrentDomain.AssemblyResolve += (sender, args) =>
            {
                return null;

//                AssemblyName aName = new AssemblyName(args.Name);
//                AssemblyBuilder ab = AppDomain.CurrentDomain.DefineDynamicAssembly(
//                        aName,
//                        AssemblyBuilderAccess.RunAndSave);
//
//                ModuleBuilder mb = ab.DefineDynamicModule(aName.Name, aName.Name + ".dll");
//
//                TypeBuilder tb = mb.DefineType("CrystalQuarts.Samples.Common.PrintMessageJob", TypeAttributes.Public);
//
//                Type t = tb.CreateType();
//
//                return ab;
            };

            ThreadPool.QueueUserWorkItem(state => DoPolling());
        }

        public void Dispose()
        {
            _disposed = true;
        }

        private void DoPolling()
        {
            while (!_disposed)
            {
                try
                {


                    IList<IJobExecutionContext> executingNow = _scheduler.GetCurrentlyExecutingJobs();

                    foreach (IJobExecutionContext executionContext in executingNow)
                    {
                        string triggerKey = executionContext.Trigger.Key.ToString();
                        string fireInstanceId = executionContext.FireInstanceId;

                        if (!_workingNow.Any(x => x.TriggerKey == triggerKey && x.FireInstanceId == fireInstanceId))
                        {
                            _workingNow.Add(new RuntimeTriggerData(triggerKey, fireInstanceId));

                            _eventsHub.Push(new SchedulerEvent(
                                SchedulerEventScope.Trigger,
                                SchedulerEventType.Fired,
                                triggerKey,
                                fireInstanceId));
                        }
                    }

                    RuntimeTriggerData[] itemsToDelete =
                    (from x in _workingNow
                        where
                        !executingNow.Any(
                            y => y.FireInstanceId == x.FireInstanceId && y.Trigger.Key.ToString() == x.TriggerKey)
                        select x).ToArray();

                    foreach (RuntimeTriggerData triggerData in itemsToDelete)
                    {
                        _workingNow.Remove(triggerData);

                        _eventsHub.Push(new SchedulerEvent(
                            SchedulerEventScope.Trigger,
                            SchedulerEventType.Complete,
                            triggerData.TriggerKey,
                            triggerData.FireInstanceId));
                    }

                    Thread.Sleep(_pollingInterval);
                }
                catch (Exception ex)
                {
                }
            }
        }
    }

    internal class RuntimeTriggerData
    {
        private readonly string _triggerKey;
        private readonly string _fireInstanceId;

        public RuntimeTriggerData(string triggerKey, string fireInstanceId)
        {
            _triggerKey = triggerKey;
            _fireInstanceId = fireInstanceId;
        }

        public string TriggerKey
        {
            get { return _triggerKey; }
        }

        public string FireInstanceId
        {
            get { return _fireInstanceId; }
        }
    }
}