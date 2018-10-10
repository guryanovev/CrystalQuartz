namespace CrystalQuartz.WebFramework.HttpAbstractions
{
    using System.Collections.Generic;

    public interface IRequest
    {
        IEnumerable<string> AllKeys { get; }

        string this[string key]
        {
            get;
        }
    }
}