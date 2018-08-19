namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.IO;
    using CrystalQuartz.Core.Domain.Base;
    using CrystalQuartz.WebFramework.Serialization;

    public class ErrorMessageSerializer : ISerializer<ErrorMessage>
    {
        public void Serialize(ErrorMessage target, TextWriter output)
        {
            output.Write('{');
            output.WritePropertyName("_");
            output.WriteValueString(target.Message);

            if (target.Level > 0)
            {
                output.Write(',');
                output.WritePropertyName("l");
                output.WriteValueNumber(target.Level);
            }
            
            output.Write('}');
        }
    }
}