namespace CrystalQuartz.Core.Services.JobResultAnalysing
{
    using System;

    public class JobResult
    {
        public static readonly JobResult Success = new JobResult(false, null);

        public JobResult(bool faulted, Exception error)
        {
            Faulted = faulted;
            Error = error;
        }

        public bool Faulted { get; }

        public Exception Error { get; }
    }
}