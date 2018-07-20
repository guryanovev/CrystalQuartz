using System;
using System.Threading.Tasks;
using Quartz;

namespace Demo.Quartz3.Web.Owin
{
    public class HelloJob : IJob
    {
        private static readonly Random Random = new Random();

        public Task Execute(IJobExecutionContext context)
        {
            Console.WriteLine("Hello, CrystalQuartz!");

            return Task.Delay(TimeSpan.FromSeconds(Random.Next(10, 20)));
        }
    }
}