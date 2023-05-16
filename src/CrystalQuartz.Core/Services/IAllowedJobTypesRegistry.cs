namespace CrystalQuartz.Core.Services
{
    using System;
    using System.Threading.Tasks;

    public interface IAllowedJobTypesRegistry
    {
        Task<Type[]> List();
    }
}