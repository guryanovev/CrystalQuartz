namespace CrystalQuartz.Web
{
    /// <summary>
    /// Exposes platform info the app was build for.
    /// The values should match the TargetFrameworks from csproj file.
    /// </summary>
    public class FrameworkVersion
    {
#if NET40
        public const string Value = ".NET Framework 4.0";
#elif NET45
        public const string Value = ".NET Framework 4.5";
#else
        public const string Value = ".NET Framework 4.5.2";
#endif
    }
}