namespace CrystalQuartz.Core.Domain.ObjectInput
{
    using System;
    using System.Globalization;

    public class StandardInputTypeConverter : IInputTypeConverter
    {
        private readonly CultureInfo _cultureInfo;
        private readonly TypeCode _typeCode;

        public StandardInputTypeConverter(CultureInfo cultureInfo, TypeCode typeCode)
        {
            _cultureInfo = cultureInfo;
            _typeCode = typeCode;
        }

        public object Convert(string input)
        {
            return System.Convert.ChangeType(input, _typeCode, _cultureInfo);
        }
    }
}