using CrystalQuartz.Core.Domain;
using CrystalQuartz.WebFramework.Commands;

namespace CrystalQuartz.Web.Comands.Outputs
{
    public class TriggerDataOutput : CommandResult
    {
         public TriggerData Trigger { get; set; }
    }
}