namespace CrystalQuartz.Web.Configuration
{
    using System.Configuration;

    public class ProviderSectionHandler : DictionarySectionHandler
    {
        protected override string KeyAttributeName
        {
            get
            {
                return "property";
            }
        }

        protected override string ValueAttributeName
        {
            get
            {
                return "value";
            }
        }
    }
}