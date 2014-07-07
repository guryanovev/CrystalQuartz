using System;

namespace CrystalQuartz.WebFramework.Commands
{
    public abstract class AbstractCommand<TInput, TOutput> : ICommand<TInput> 
        where TOutput : CommandResult, new()
    {
        public object Execute(TInput input)
        {
            var result = new TOutput();
            result.Success = true;
            try
            {
                InternalExecute(input, result);
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.ErrorMessage = ex.Message;
            }

            return result;
        }

        protected abstract void InternalExecute(TInput input, TOutput output);
    }
}