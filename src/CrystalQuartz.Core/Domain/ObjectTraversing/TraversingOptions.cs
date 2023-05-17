namespace CrystalQuartz.Core.Domain.ObjectTraversing
{
    public class TraversingOptions
    {
        public TraversingOptions(
            int maxGraphDepth,
            int maxPropertiesCount,
            int maxEnumerableLength)
        {
            MaxGraphDepth = maxGraphDepth;
            MaxPropertiesCount = maxPropertiesCount;
            MaxEnumerableLength = maxEnumerableLength;
        }

        public int MaxGraphDepth { get; }

        public int MaxPropertiesCount { get; }

        public int MaxEnumerableLength { get; }
    }
}