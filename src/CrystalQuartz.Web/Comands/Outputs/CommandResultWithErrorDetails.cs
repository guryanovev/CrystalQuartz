using CrystalQuartz.WebFramework.Commands;

namespace CrystalQuartz.Web.Comands.Outputs
{
    public class CommandResultWithErrorDetails : CommandResult
    {
        public Property[] ErrorDetails { get; set; }
    }
}