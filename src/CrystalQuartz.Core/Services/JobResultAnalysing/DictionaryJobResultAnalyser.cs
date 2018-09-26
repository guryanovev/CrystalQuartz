namespace CrystalQuartz.Core.Services.JobResultAnalysing
{
    using System;
    using System.Collections;

    public class DictionaryJobResultAnalyser : IJobResultAnalyser
    {
        private readonly string _failedKey;
        private readonly string _successKey;
        private readonly string _exceptionKey;

        public DictionaryJobResultAnalyser(string failedKey, string successKey, string exceptionKey)
        {
            _failedKey = failedKey;
            _successKey = successKey;
            _exceptionKey = exceptionKey;
        }

        public JobResult Analyse(object jobResult)
        {
            if (jobResult is IDictionary dictionary)
            {
                Exception exception = FetchException(dictionary);
                bool failed = exception != null || DetectFailure(dictionary);

                return new JobResult(failed, exception);
            }

            return null;
        }

        private bool DetectFailure(IDictionary dictionary)
        {
            if (_failedKey != null && dictionary.Contains(_failedKey))
            {
                var failed = dictionary[_failedKey];
                return true.Equals(failed);
            }

            if (_successKey != null && dictionary.Contains(_successKey))
            {
                var success = dictionary[_successKey];
                return false.Equals(success);
            }

            return false;
        }

        private Exception FetchException(IDictionary dictionary)
        {
            if (_exceptionKey != null && dictionary.Contains(_exceptionKey))
            {
                return dictionary[_exceptionKey] as Exception;
            }

            return null;
        }
    }
}