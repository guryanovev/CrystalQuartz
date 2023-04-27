namespace CrystalQuartz.Build.Helpers
{
    using System.Runtime.InteropServices;
    using Rosalia.Core.Tasks;
    using Rosalia.Core.Tasks.Results;
    using Rosalia.FileSystem;
    using Rosalia.TaskLib.Standard.Tasks;

    public static class NpmExtensions
    {
        public static bool IsWindows() => RuntimeInformation.IsOSPlatform(OSPlatform.Windows);
        
        public static ITask<Nothing> CreateNpmTask(this TaskContext context, IDirectory directory, string command)
        {
            var commandFields = IsWindows()
                ? new
                {
                    ToolPath = "cmd.exe",
                    Arguments = "/c npm.cmd " + command
                } :
                new
                {
                    ToolPath = "npm",
                    Arguments = command
                };

            return new ExecTask
            {
                ToolPath = commandFields.ToolPath,
                Arguments = commandFields.Arguments,
                WorkDirectory = directory
            };
        }
    }
}