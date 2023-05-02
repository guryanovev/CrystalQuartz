namespace CrystalQuartz.Application.Commands.Outputs
{
    using System.Collections.Generic;
    using CrystalQuartz.WebFramework.Commands;

    public class AddTriggerOutput : CommandResult
    {
        public IDictionary<string, string> ValidationErrors { get; set; }
    }
}