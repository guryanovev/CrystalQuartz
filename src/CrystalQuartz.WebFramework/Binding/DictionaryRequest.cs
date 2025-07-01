namespace CrystalQuartz.WebFramework.Binding
{
    using System;
    using System.Collections.Generic;
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public class DictionaryRequest : IRequest
    {
        private readonly IDictionary<string, string?> _items = new Dictionary<string, string?>(StringComparer.InvariantCultureIgnoreCase);

        public IEnumerable<string> AllKeys => _items.Keys;

        public string? this[string key]
        {
            get => _items.ContainsKey(key) ? _items[key] : null;
            set => _items[key] = value;
        }
    }
}