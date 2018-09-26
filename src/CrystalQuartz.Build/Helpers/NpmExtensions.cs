namespace CrystalQuartz.Build.Helpers
{
    using Rosalia.Core.Tasks;
    using Rosalia.Core.Tasks.Results;
    using Rosalia.FileSystem;
    using Rosalia.TaskLib.Standard.Tasks;

    public static class NpmExtensions
    {
        public static ITask<Nothing> CreateNpmTask(this TaskContext context, IDirectory directory, string command)
        {
            var commandFields = context.Environment.IsMono
                ? new
                {
                    ToolPath = "npm",
                    Arguments = command
                } :
                new
                {
                    ToolPath = "cmd.exe",
                    Arguments = "/c npm.cmd " + command
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