using System;
using CrystalQuartz.Core.Domain;
using CrystalQuartz.WebFramework.Serialization;

namespace CrystalQuartz.Application.Comands.Serialization
{
    public static class CommonSerializers
    {
        public static readonly ISerializer<Type> TypeSerializer = new TypeSerializer();

        public static readonly ISerializer<Property> PropertySerializer = new PropertySerializer();
    }
}