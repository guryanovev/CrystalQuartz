cd src/.nuget
NuGet.exe install Rosalia -ExcludeVersion -OutputDirectory "../../tools"
cd "../../tools/Rosalia/tools"
Rosalia /wd="../../../src" /hold "CrystalQuartz.Build/CrystalQuartz.Build.csproj"
pause