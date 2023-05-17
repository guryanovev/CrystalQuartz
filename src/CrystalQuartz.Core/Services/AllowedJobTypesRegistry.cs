namespace CrystalQuartz.Core.Services
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;
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

        public async Task<Type[]> List()
        {
            return _userConfiguredTypes
                .Concat(await _schedulerClerk.GetScheduledJobTypes())
                .Distinct()
                .ToArray();
        }
    }
}