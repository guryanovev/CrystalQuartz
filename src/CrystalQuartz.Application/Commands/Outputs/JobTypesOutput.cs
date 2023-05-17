namespace CrystalQuartz.Application.Commands.Outputs
{
    using System;
    using CrystalQuartz.WebFramework.Commands;

    public class JobTypesOutput : CommandResult
    {
        public Type[] AllowedTypes { get; set; }
    }
}