using System;
using System.Threading.Tasks;
using Quartz;

namespace Demo.Quartz3.Web.Owin
{
    public class HelloJob : IJob
    {
        public async Task Execute(IJobExecutionContext context)
        {
            Console.WriteLine("Hello, CrystalQuartz!");
        }
    }
}