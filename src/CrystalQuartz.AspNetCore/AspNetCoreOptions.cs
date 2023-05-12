namespace CrystalQuartz.AspNetCore
{
    using System;

    public class AspNetCoreOptions
    {
        [Obsolete]
        public bool ForceSyncIO { get; set; } = false;
    }
}