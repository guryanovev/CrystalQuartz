namespace CrystalQuartz.Web.Demo
{
    using System;
    using System.Threading;
    using Quartz;

    public class HelloJob : IJob
    {
        public void Execute(IJobExecutionContext context)
        {
            Thread.Sleep(TimeSpan.FromSeconds(20));
            Console.WriteLine("Hello, CrystalQuartz!");
        }
    }
}