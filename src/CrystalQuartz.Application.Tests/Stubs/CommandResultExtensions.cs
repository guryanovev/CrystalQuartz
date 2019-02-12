namespace CrystalQuartz.Application.Tests.Stubs
{
    using CrystalQuartz.WebFramework.Commands;
    using NUnit.Framework;

    public static class CommandResultExtensions
    {
        public static void AssertSuccessfull(this CommandResult result)
        {
            if (!result.Success)
            {
                Assert.Fail("Expected successfull result but got error: " + result.ErrorMessage);
            }
        }
    }
}