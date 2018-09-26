namespace CrystalQuartz.Core.Domain.Base
{
    public class ErrorMessage
    {
        public ErrorMessage(string message, int level)
        {
            Message = message;
            Level = level;
        }

        public string Message { get; }

        public int Level { get; }
    }
}