namespace CrystalQuartz.Core.Quartz2
{
    using System.Threading.Tasks;

    public static class AsyncUtils
    {
        public static Task<T> FromResult<T>(T result)
        {
#if NET40
            return TaskEx.FromResult(result);
#else
            return Task.FromResult(result);
#endif
        }
    }
}