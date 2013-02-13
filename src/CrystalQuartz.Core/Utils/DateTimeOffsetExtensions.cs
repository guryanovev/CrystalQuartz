namespace CrystalQuartz.Core.Utils
{
    using System;

    public static class DateTimeOffsetExtensions
    {
         public static DateTime? ToDateTime(this DateTimeOffset? offset)
         {
             if (offset.HasValue)
             {
                 return offset.Value.DateTime;
             }

             return null;
         }
    }
}