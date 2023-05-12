namespace CrystalQuartz.Core.Utils
{
    using System;

    public static class DateTimeOffsetExtensions
    {
        private static readonly DateTime UnixTimestampOrigin = new DateTime(1970, 1, 1);

        public static long UnixTicks(this DateTime dt)
        {
            return (long)new TimeSpan(dt.Ticks - UnixTimestampOrigin.Ticks).TotalMilliseconds;
        }

        public static long? ToUnixTicks(this DateTimeOffset? offset)
        {
            return offset.ToDateTime()?.UnixTicks();
        }

        public static long ToUnixTicks(this DateTimeOffset offset)
        {
            return offset.DateTime.UnixTicks();
        }

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