using System;
using System.Threading.Tasks;
using Quartz;

namespace CqSamples.Quartz3.SystemWeb.RemoteScheduler
{
    public class PrintMessageJob : IJob
    {
        private static readonly Random Random = new Random();

        public Task Execute(IJobExecutionContext context)
        {
            var color = Console.ForegroundColor;
            Console.ForegroundColor = ConsoleColor.DarkYellow;
            Console.WriteLine("Greetings from HelloJob!");
            Console.ForegroundColor = color;

            return Task.Delay(TimeSpan.FromSeconds(Random.Next(1, 20)));
        }
    }
}