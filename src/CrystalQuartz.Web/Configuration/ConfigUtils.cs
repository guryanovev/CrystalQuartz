namespace CrystalQuartz.Web.Configuration
{
    using System;
    using System.Collections;
    using System.Web.Configuration;
    using CrystalQuartz.Core.SchedulerProviders;

    public static class ConfigUtils
    {
        public static string CustomCssUrl
        {
            get
            {
                CrystalQuartzOptionsSection section = (CrystalQuartzOptionsSection)WebConfigurationManager.GetSection("crystalQuartz/options");
                if (section == null)
                {
                    return null;
                }

                return section.CustomCssUrl;
            }
        }

        public static ISchedulerProvider SchedulerProvider
        {
            get
            {
                var section = (Hashtable) WebConfigurationManager.GetSection("crystalQuartz/provider");
                var type = Type.GetType(section["Type"].ToString());
                var provider = Activator.CreateInstance(type);
                foreach (string property in section.Keys)
                {
                    if (property != "Type")
                    {
                        provider.GetType().GetProperty(property).SetValue(provider, section[property], new object[]{});
                    }
                }

                return (ISchedulerProvider) provider;
            }
        }
    }
}