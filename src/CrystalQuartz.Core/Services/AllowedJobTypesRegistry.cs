namespace CrystalQuartz.Core.Services
{
    using System;
    using System.Linq;
    using CrystalQuartz.Core.Contracts;

    public class AllowedJobTypesRegistry : IAllowedJobTypesRegistry
    {
        private readonly Type[] _userConfiguredTypes;
        private readonly ISchedulerClerk _schedulerClerk;

        public AllowedJobTypesRegistry(Type[] userConfiguredTypes, ISchedulerClerk schedulerClerk)
        {
            _userConfiguredTypes = userConfiguredTypes;
            _schedulerClerk = schedulerClerk;
        }

        public Type[] List()
        {
            return _userConfiguredTypes
                .Concat(_schedulerClerk.GetScheduledJobTypes())
                .Distinct()
                .ToArray();
        }
    }
}