namespace CrystalQuartz.Core.Domain.ObjectInput
{
    public interface IInputTypeConverter
    {
        object Convert(string input);
    }
}