namespace CrystalQuartz.Stubs
{
    using System;
    using CrystalQuartz.Core.Services;

    public class AllowedJobTypesRegistryStub : IAllowedJobTypesRegistry
    {
        private readonly Type[] _types;

        public AllowedJobTypesRegistryStub(Type[] types)
        {
            _types = types;
        }

        public Type[] List()
        {
            return _types;
        }
    }
}