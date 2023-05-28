namespace CrystalQuartz.Application
{
    using System.Threading.Tasks;

    public static class AsyncUtils
    {
        public static Task<T> FromResult<T>(T result)
        {
#if NETSTANDARD2_0_OR_GREATER || NET46_OR_GREATER
            return Task.FromResult(result);
#elif NET40
            return TaskEx.FromResult(result);
#else
            return Task.FromResult(result);
#endif
        }
        public static Task CompletedTask()
        {
#if NETSTANDARD2_0_OR_GREATER || NET46_OR_GREATER
            return Task.CompletedTask;
#elif NET40
            return TaskEx.FromResult<object?>(null);
#else
            return Task.FromResult<object?>(null);
#endif
        }
    }
}