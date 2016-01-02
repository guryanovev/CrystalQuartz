namespace CrystalQuartz.Web.Configuration
{
    using System.Configuration;

    public class CrystalQuartzOptionsSection : ConfigurationSection 
    {
        [ConfigurationProperty("customCssUrl", IsRequired = true)]
        public string CustomCssUrl
        {
            get { return (string)this["customCssUrl"]; }
            set { this["customCssUrl"] = value; }
        }
    }
}