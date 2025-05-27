﻿namespace CrystalQuartz.WebFramework.Response
{
    using System.IO;
    using System.Threading.Tasks;
    using CrystalQuartz.WebFramework.HttpAbstractions;
    using CrystalQuartz.WebFramework.Serialization;

    public class SerializationBasedResponseFiller<T> : DefaultResponseFiller
    {
        private readonly ISerializer<T> _serializer;
        private readonly Task<T> _model;

        public SerializationBasedResponseFiller(ISerializer<T> serializer, string contentType, Task<T> model)
        {
            _serializer = serializer;
            ContentType = contentType;
            _model = model;
        }

        public override string ContentType { get; }

        protected override async Task InternalFillResponse(Stream outputStream, IRequest request)
        {
            await using (StreamWriter writer = new StreamWriter(outputStream))
            {
                await _serializer.Serialize(await _model, writer);
            }
        }
    }
}