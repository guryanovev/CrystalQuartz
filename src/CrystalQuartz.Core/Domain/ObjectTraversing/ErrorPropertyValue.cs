namespace CrystalQuartz.Core.Domain.ObjectTraversing
{
    public class ErrorPropertyValue : PropertyValue
    {
        public ErrorPropertyValue(string message)
            : base(null)
        {
            Message = message;
        }

        public string Message { get; }
    }
}