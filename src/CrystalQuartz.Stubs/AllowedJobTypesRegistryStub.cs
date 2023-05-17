namespace CrystalQuartz.Stubs
{
    using System;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Services;

    public class AllowedJobTypesRegistryStub : IAllowedJobTypesRegistry
    {
        private readonly Type[] _types;

        public AllowedJobTypesRegistryStub(Type[] types)
        {
            _types = types;
        }

        public Task<Type[]> List()
        {
            return Task.FromResult(_types);
        }
    }
}