namespace CrystalQuartz.Core.Domain.TriggerTypes
{
    public abstract class TriggerType
    {
        protected TriggerType(string code)
        {
            Code = code;
        }

        public string Code { get; }
    }
}