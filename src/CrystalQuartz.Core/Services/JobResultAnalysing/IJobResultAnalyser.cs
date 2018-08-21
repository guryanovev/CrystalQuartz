namespace CrystalQuartz.Core.Services.JobResultAnalysing
{
    public interface IJobResultAnalyser
    {
        JobResult Analyse(object jobResult);
    }
}