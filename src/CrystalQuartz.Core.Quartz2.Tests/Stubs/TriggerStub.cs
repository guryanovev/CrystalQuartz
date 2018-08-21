namespace CrystalQuartz.Core.Quartz2.Tests.Stubs
{
    using Quartz.Impl.Triggers;

    public class TriggerStub : SimpleTriggerImpl
    {
        public TriggerStub(string name) : base(name)
        {
        }

        public TriggerStub(string name, string @group) : base(name, @group)
        {
        }
    }
}