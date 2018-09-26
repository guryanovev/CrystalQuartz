using System;
using System.Threading.Tasks;
using Quartz;

namespace Demo.Quartz3.Web.Owin
{
    using System.Collections.Generic;

    public class HelloJob : IJob
    {
        private static readonly Random Random = new Random();

        public Task Execute(IJobExecutionContext context)
        {
            Console.WriteLine("Hello, CrystalQuartz!");

            if (Random.Next(10) > 5)
            {
                context.Result = new Dictionary<string, object>
                {
                    { "Failed", true },
                    { "Error", new Exception("Message 1", new Exception("Please make sure the server application at quartz is up and running.")) }
                };

                //return Task.Delay(TimeSpan.FromSeconds(Random.Next(10, 20))).ContinueWith(task => throw new Exception("Exception test"));
            }

            return Task.Delay(TimeSpan.FromSeconds(Random.Next(10, 20)));
        }
    }
}