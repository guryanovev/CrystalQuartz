namespace CrystalQuartz.WebFramework.Config
{
    using System.Collections.Generic;
    using CrystalQuartz.WebFramework.Request;

    public interface IHandlerConfig
    {
        IEnumerable<IRequestHandler> Handlers { get; }

        FillerConfig WhenCommand(string command);

        FillerConfig WhenPath(string path);

        FillerConfig Else();
    }
}