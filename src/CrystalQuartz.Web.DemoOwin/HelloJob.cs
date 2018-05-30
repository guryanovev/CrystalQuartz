using System.Threading.Tasks;

namespace CrystalQuartz.Web.DemoOwin
{
    using System;
    using Quartz;

    public class HelloJob : IJob
    {
        public async Task Execute(IJobExecutionContext context)
        {
            Console.WriteLine("Hello, CrystalQuartz!");
        }
    }
}