namespace CrystalQuartz.Core.Services.JobResultAnalysing
{
    public interface IJobResultAnalyzer
    {
        JobResult Analyze(object jobResult);
    }
}