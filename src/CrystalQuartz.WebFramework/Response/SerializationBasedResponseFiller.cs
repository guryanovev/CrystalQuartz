using System.IO;
using CrystalQuartz.WebFramework.HttpAbstractions;
using CrystalQuartz.WebFramework.Serialization;

namespace CrystalQuartz.WebFramework.Response
{
    using System.Threading.Tasks;

    public class SerializationBasedResponseFiller<T> : DefaultResponseFiller
    {
        private readonly ISerializer<T> _serializer;
        private readonly string _contentType;
        private readonly T _model;

        public SerializationBasedResponseFiller(ISerializer<T> serializer, string contentType, T model)
        {
            _serializer = serializer;
            _contentType = contentType;
            _model = model;
        }

        public override string ContentType
        {
            get { return _contentType; }
        }

        protected override Task InternalFillResponse(Stream outputStream, IRequest request)
        {
            using (var writer = new StreamWriter(outputStream)) // todo async serialization
            {
                _serializer.Serialize(_model, writer);
            }

            return Task.CompletedTask;
        }
    }
}