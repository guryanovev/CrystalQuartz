namespace CrystalQuartz.Owin
{
    /// <summary>
    /// Exposes platform info the app was build for.
    /// The values should match the TargetFrameworks from csproj file.
    /// </summary>
    public class FrameworkVersion
    {
#if NET45
        public const string Value = ".NET Framework 4.5";
#elif NET452
        public const string Value = ".NET Framework 4.5.2";
#else
        public const string Value = ".NET Standard 2.0";
#endif
    }
}