namespace CrystalQuartz.AspNetCore
{
    /// <summary>
    /// Exposes platform info the app was build for.
    /// The values should match the TargetFrameworks from csproj file.
    /// </summary>
    public class FrameworkVersion
    {
#if NETSTANDARD2_0
        public const string Value = ".NET Standard 2.0";
#else
        public const string Value = ".NET Standard 2.1";
#endif
    }
}