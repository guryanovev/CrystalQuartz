using System.IO;
using CrystalQuartz.WebFramework.HttpAbstractions;
using CrystalQuartz.WebFramework.Serialization;

namespace CrystalQuartz.WebFramework.Response
{
    using System;
    using System.Text;
    using System.Threading.Tasks;

    public class SerializationBasedResponseFiller<T> : DefaultResponseFiller
    {
        private readonly ISerializer<T> _serializer;
        private readonly T _model;

        public SerializationBasedResponseFiller(ISerializer<T> serializer, string contentType, T model)
        {
            _serializer = serializer;
            ContentType = contentType;
            _model = model;
        }

        public override string ContentType { get; }

        protected override async Task InternalFillResponse(Stream outputStream, IRequest request)
        {
#if NETSTANDARD2_1_OR_GREATER
            await using (StreamWriter writer = new StreamWriter(outputStream))
            {
#else
            using (StreamWriter writer = new StreamWriter(outputStream))
            {
#endif
                await _serializer.Serialize(_model, writer);
            }
        }
    }
}