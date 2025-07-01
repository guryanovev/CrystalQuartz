namespace CrystalQuartz.Core.Services.ExceptionTraversing
{
    using System;
    using CrystalQuartz.Core.Domain.Base;

    public interface IExceptionTransformer
    {
        ErrorMessage[]? Transform(Exception exception);
    }
}