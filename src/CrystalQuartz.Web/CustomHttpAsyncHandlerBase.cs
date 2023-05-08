#if NET40

using System.Threading.Tasks;
using System.Web;
using System;
using System.Threading;

namespace CrystalQuartz.Web
{
    /// <summary>
    /// The implementation is borrowed from https://github.com/microsoft/referencesource/blob/master/System.Web/HttpTaskAsyncHandler.cs
    ///
    /// It's needed for NET40 only. Since NET45 we should use HttpTaskAsyncHandler instead.
    /// </summary>
    public abstract class CustomHttpAsyncHandlerBase : IHttpAsyncHandler
    {
        public abstract Task ProcessRequestAsync(HttpContext context);

        public IAsyncResult BeginProcessRequest(HttpContext context, AsyncCallback cb, object extraData)
        {
            return BeginTask(() => ProcessRequestAsync(context), cb, extraData);
        }

        public void EndProcessRequest(IAsyncResult result)
        {
            EndTask(result);
        }

        public void ProcessRequest(HttpContext context)
        {
            EndProcessRequest(BeginProcessRequest(context, null, null));
        }

        public virtual bool IsReusable
        {
            get { return true; }
        }

        internal sealed class TaskWrapperAsyncResult : IAsyncResult
        {

            private bool _forceCompletedSynchronously;

            internal TaskWrapperAsyncResult(Task task, object asyncState)
            {
                Task = task;
                AsyncState = asyncState;
            }

            public object AsyncState
            {
                get;
                private set;
            }

            public WaitHandle AsyncWaitHandle
            {
                get { return ((IAsyncResult)Task).AsyncWaitHandle; }
            }

            public bool CompletedSynchronously
            {
                get { return _forceCompletedSynchronously || ((IAsyncResult)Task).CompletedSynchronously; }
            }

            public bool IsCompleted
            {
                get { return ((IAsyncResult)Task).IsCompleted; }
            }

            internal Task Task
            {
                get;
                private set;
            }

            internal void ForceCompletedSynchronously()
            {
                _forceCompletedSynchronously = true;
            }

        }

        internal static IAsyncResult BeginTask(Func<Task> taskFunc, AsyncCallback callback, object state)
        {
            Task task = taskFunc();
            if (task == null)
            {
                // Something went wrong - let our caller handle it.
                return null;
            }

            // We need to wrap the inner Task so that the IAsyncResult exposed by this method
            // has the state object that was provided as a parameter. We could be a bit smarter
            // about this to save an allocation if the state objects are equal, but that's a
            // micro-optimization.
            TaskWrapperAsyncResult resultToReturn = new TaskWrapperAsyncResult(task, state);

            // Task instances are always marked CompletedSynchronously = false, even if the
            // operation completed synchronously. We should detect this and modify the IAsyncResult
            // we pass back to our caller as appropriate. Only read the 'IsCompleted' property once
            // to avoid a race condition where the underlying Task completes during this method.
            bool actuallyCompletedSynchronously = task.IsCompleted;
            if (actuallyCompletedSynchronously)
            {
                resultToReturn.ForceCompletedSynchronously();
            }

            if (callback != null)
            {
                // ContinueWith() is a bit slow: it captures execution context and hops threads. We should
                // avoid calling it and just invoke the callback directly if the underlying Task is
                // already completed. Only use ContinueWith as a fallback. There's technically a ---- here
                // in that the Task may have completed between the check above and the call to
                // ContinueWith below, but ContinueWith will do the right thing in both cases.
                if (actuallyCompletedSynchronously)
                {
                    callback(resultToReturn);
                }
                else
                {
                    task.ContinueWith(_ => callback(resultToReturn));
                }
            }

            return resultToReturn;
        }

        // The parameter is named 'ar' since it matches the parameter name on the EndEventHandler delegate type,
        // and we expect that most consumers will end up invoking this method via an instance of that delegate.
        internal static void EndTask(IAsyncResult ar)
        {
            if (ar == null)
            {
                throw new ArgumentNullException("ar");
            }

            // Make sure the incoming parameter is actually the correct type.
            TaskWrapperAsyncResult taskWrapper = ar as TaskWrapperAsyncResult;
            if (taskWrapper == null)
            {
                // extraction failed
                throw new ArgumentException("extraction failed");
            }

            // The End* method doesn't actually perform any actual work, but we do need to maintain two invariants:
            // 1. Make sure the underlying Task actually *is* complete.
            // 2. If the Task encountered an exception, observe it here.
            // (TaskAwaiter.GetResult() handles both of those, and it rethrows the original exception rather than an AggregateException.)
            taskWrapper.Task.GetAwaiter().GetResult();
        }
    }
}

#endif