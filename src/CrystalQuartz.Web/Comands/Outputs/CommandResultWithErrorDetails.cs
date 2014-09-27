namespace CrystalQuartz.Web.Comands.Outputs
{
    using CrystalQuartz.WebFramework.Commands;

    public class CommandResultWithErrorDetails : CommandResult
    {
        public Property[] ErrorDetails { get; set; }
    }
}