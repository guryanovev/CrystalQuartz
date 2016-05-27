namespace CrystalQuartz.Samples.RemoteScheduler.Server
{
    using System;
    using Quartz;

    public class PrintMessageJob : IJob
    {
        public void Execute(IJobExecutionContext context)
        {
            Console.WriteLine("Hello!");
        }
    }
}