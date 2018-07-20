using System.Threading;

namespace CrystalQuarts.Samples.Common
{
    using System;
    using Quartz;

    public class PrintMessageJob : IJob
    {
        private static readonly Random Random = new Random();

        public void Execute(IJobExecutionContext context)
        {
            Thread.Sleep(TimeSpan.FromSeconds(Random.Next(1, 20)));

            var color = Console.ForegroundColor;
            Console.ForegroundColor = ConsoleColor.DarkYellow;
            Console.WriteLine("Greetings from HelloJob!");
            Console.ForegroundColor = color;
        }
    }
}