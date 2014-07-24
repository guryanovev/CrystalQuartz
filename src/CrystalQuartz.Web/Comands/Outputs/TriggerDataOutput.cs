using CrystalQuartz.Core.Domain;

namespace CrystalQuartz.Web.Comands.Outputs
{
    public class TriggerDataOutput : CommandResultWithErrorDetails
    {
         public TriggerData Trigger { get; set; }
    }
}