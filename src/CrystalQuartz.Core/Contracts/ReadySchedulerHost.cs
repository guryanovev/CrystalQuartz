namespace CrystalQuartz.Core.Contracts
{
    using System;
    using CrystalQuartz.Core.Domain.Events;
    using CrystalQuartz.Core.Services;

    public class ReadySchedulerHost : SchedulerHost
    {
        private readonly ISchedulerEventTarget? _eventTarget;

        public ReadySchedulerHost(
            ISchedulerClerk clerk,
            ISchedulerCommander commander,
            Version quartzVersion,
            ISchedulerEventHub eventHub,
            ISchedulerEventTarget eventTarget,
            IAllowedJobTypesRegistry allowedJobTypesRegistry)

            : base(quartzVersion)
        {
            _eventTarget = eventTarget;
            AllowedJobTypesRegistry = allowedJobTypesRegistry;
            Clerk = clerk;
            Commander = commander;
            EventHub = eventHub;
        }

        public override ISchedulerClerk Clerk { get; }

        public override ISchedulerCommander Commander { get; }

        public override ISchedulerEventHub EventHub { get; }

        public override IAllowedJobTypesRegistry AllowedJobTypesRegistry { get; }

        public override bool Faulted => false;

        public override string[]? Errors => null;

        public override void RaiseEvent(RawSchedulerEvent @event)
        {
            _eventTarget?.Push(@event);
        }
    }
}