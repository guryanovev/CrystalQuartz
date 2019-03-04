namespace CrystalQuartz.Core.Services
{
    using System;

    public interface IAllowedJobTypesRegistry
    {
        Type[] List();
    }
}