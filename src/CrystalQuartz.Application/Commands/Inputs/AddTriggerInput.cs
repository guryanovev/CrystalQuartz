﻿namespace CrystalQuartz.Application.Commands.Inputs
{
    public class AddTriggerInput : JobInput
    {
        /// <summary>
        /// New trigger name (optional)
        /// </summary>
        public string? Name { get; set; }

        public string TriggerType { get; set; } = default!;

        public string? CronExpression { get; set; }

        public bool RepeatForever { get; set; }

        public int RepeatCount { get; set; }

        public long RepeatInterval { get; set; }

        public JobDataItem[]? JobDataMap { get; set; }

        public string? JobClass { get; set; }
    }
}