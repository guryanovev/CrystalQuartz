using System.IO;
using CrystalQuartz.WebFramework.HttpAbstractions;
using CrystalQuartz.WebFramework.Serialization;

namespace CrystalQuartz.WebFramework.Response
{
    using System;
    using System.Text;
    using System.Threading.Tasks;
    using Utils;

    public class SerializationBasedResponseFiller<T> : DefaultResponseFiller
    {
        private readonly IStreamWriterSessionProvider _sessionProvider;
        private readonly ISerializer<T> _serializer;
        private readonly T _model;

        public SerializationBasedResponseFiller(IStreamWriterSessionProvider sessionProvider, ISerializer<T> serializer, string contentType, T model)
        {
            _sessionProvider = sessionProvider;
            _serializer = serializer;
            ContentType = contentType;
            _model = model;
        }

        public override string ContentType { get; }

        protected override async Task InternalFillResponse(Stream outputStream, IRequest request)
        {
            await _sessionProvider.UseWriter(outputStream, async writer =>
            {
                await _serializer.Serialize(_model, writer);
            });
        }
    }
}