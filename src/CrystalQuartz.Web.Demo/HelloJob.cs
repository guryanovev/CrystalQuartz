namespace CrystalQuartz.Web.Demo
{
    using System;
    using Quartz;

    public class HelloJob : IJob
    {
        public void Execute(JobExecutionContext context)
        {
            Console.WriteLine("Hello, CrystalQuartz!");
        }
    }
}