namespace CrystalQuartz.Core.Tests
{
    using System;
    using NUnit.Framework;
    using Rhino.Mocks;

    public abstract class MockSupportTests
    {
        protected MockRepository _mockRepository;

        [SetUp]
        public void Init()
        {
            _mockRepository = new MockRepository();
            InternalInit();
        }

        protected abstract void InternalInit();

        protected void Verify(Action action)
        {
            With.Mocks(_mockRepository).Verify(() => action());
        }
    }
}