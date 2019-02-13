namespace CrystalQuartz.Core.Quartz3.Tests
{
    using System.Threading.Tasks;
    using Quartz;

    public class TestJob : IJob
    {
        public Task Execute(IJobExecutionContext context)
        {
            return Task.Delay(0);
        }
    }
}