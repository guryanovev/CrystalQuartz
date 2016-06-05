namespace CrystalQuarts.Samples.Common
{
    using System;
    using Quartz;

    public class PrintMessageJob : IJob
    {
        public void Execute(IJobExecutionContext context)
        {
            var color = Console.ForegroundColor;
            Console.ForegroundColor = ConsoleColor.DarkYellow;
            Console.WriteLine("Greetings from HelloJob!");
            Console.ForegroundColor = color;
        }
    }
}