namespace CrystalQuartz.WebFramework.Routing
{
    public interface IUrlParser
    {
        UrlData Parse(string url, string pattern);
    }
}