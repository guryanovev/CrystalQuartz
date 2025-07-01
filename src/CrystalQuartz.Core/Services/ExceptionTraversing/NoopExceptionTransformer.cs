namespace CrystalQuartz.Core.Services.ExceptionTraversing
{
    using System;
    using CrystalQuartz.Core.Domain.Base;

    public class NoopExceptionTransformer : IExceptionTransformer
    {
        public ErrorMessage[]? Transform(Exception exception)
        {
            return null;
        }
    }
}