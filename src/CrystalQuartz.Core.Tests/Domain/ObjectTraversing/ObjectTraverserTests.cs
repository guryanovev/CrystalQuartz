namespace CrystalQuartz.Core.Tests.Domain.ObjectTraversing
{
    using System;
    using System.Collections.Generic;
    using CrystalQuartz.Core.Domain.ObjectTraversing;
    using CrystalQuartz.Core.Utils;
    using NUnit.Framework;

    [TestFixture]
    public class ObjectTraverserTests
    {
        private static readonly TraversingOptions UnlimitedOptions = new TraversingOptions(int.MaxValue, int.MaxValue, int.MaxValue);

        [Test]
        public void TraverseByAccessor_Null_ShouldReturnNull()
        {
            var result = TraverseWithoutLimits(() => null);

            Assert.That(result, Is.Null);
        }

        [Test]
        public void TraverseByAccessor_Exception_ShouldReturnErrorValue()
        {
            var result = TraverseWithoutLimits(() => throw new Exception("MESSAGE"));

            Assert.That(result, Is.InstanceOf<ErrorPropertyValue>());
            Assert.That((result as ErrorPropertyValue)!.Message, Is.EqualTo("MESSAGE"));
        }

        [Test]
        public void TraverseByAccessor_Decimal_ShouldReturnSingleValue()
        {
            var result = TraverseWithoutLimits(() => 1m);

            Assert.That(result, Is.InstanceOf<SinglePropertyValue>());
            Assert.That((result as SinglePropertyValue)!.RawValue, Is.EqualTo("1"));
            Assert.That((result as SinglePropertyValue)!.Kind, Is.EqualTo(SingleValueKind.Numeric));
        }

        [Test]
        public void TraverseByAccessor_Type_ShouldReturnSingleValue()
        {
            var result = TraverseWithoutLimits(() => typeof(ObjectTraverserTests));

            Assert.That(result, Is.InstanceOf<SinglePropertyValue>());
            Assert.That((result as SinglePropertyValue)!.RawValue, Is.EqualTo("CrystalQuartz.Core.Tests.Domain.ObjectTraversing.ObjectTraverserTests"));
            Assert.That((result as SinglePropertyValue)!.Kind, Is.EqualTo(SingleValueKind.Type));
        }

        [Test]
        public void TraverseByAccessor_Date_ShouldReturnSingleValue()
        {
            var date = DateTime.Now;
            var result = TraverseWithoutLimits(() => date);

            Assert.That(result, Is.InstanceOf<SinglePropertyValue>());
            Assert.That((result as SinglePropertyValue)!.RawValue, Is.EqualTo(date.UnixTicks().ToString()));
            Assert.That((result as SinglePropertyValue)!.Kind, Is.EqualTo(SingleValueKind.Date));
        }

        [Test]
        public void TraverseByAccessor_NumericPrimitive_ShouldReturnSingleValue()
        {
            var results = new[]
            {
                TraverseWithoutLimits(() => 1),
                TraverseWithoutLimits(() => 1L),
                TraverseWithoutLimits(() => 1d)
            };

            foreach (var item in results)
            {
                Assert.That(item, Is.InstanceOf<SinglePropertyValue>());
                Assert.That((item as SinglePropertyValue)!.RawValue, Is.EqualTo("1"));
                Assert.That((item as SinglePropertyValue)!.Kind, Is.EqualTo(SingleValueKind.Numeric));
            }
        }

        [Test]
        public void TraverseByAccessor_StringAndChar_ShouldReturnSingleValue()
        {
            var results = new[]
            {
                TraverseWithoutLimits(() => 't'),
                TraverseWithoutLimits(() => "t")
            };

            foreach (var item in results)
            {
                Assert.That(item, Is.InstanceOf<SinglePropertyValue>());
                Assert.That((item as SinglePropertyValue)!.RawValue, Is.EqualTo("t"));
                Assert.That((item as SinglePropertyValue)!.Kind, Is.EqualTo(SingleValueKind.String));
            }
        }

        /*
         *  ─────█─▄▀█──█▀▄─█───── 
         *  ────▐▌──────────▐▌──── 
         *  ────█▌▀▄──▄▄──▄▀▐█──── 
         *  ───▐██──▀▀──▀▀──██▌─── 
         *  ──▄████▄──▐▌──▄████▄──
         */
        [Test]
        public void TraverseByAccessor_Anonymous_ShouldReadProperties()
        {
            var result = TraverseWithoutLimits(() => new
            {
                FirstName = "Guy"
            });

            Assert.That(result, Is.InstanceOf<ObjectPropertyValue>());

            var objectPropertyValue = (ObjectPropertyValue) result!;

            Assert.That(objectPropertyValue.NestedProperties.Length, Is.EqualTo(1));
            Assert.That(objectPropertyValue.NestedProperties[0].Title, Is.EqualTo("FirstName"));
        }

        [Test]
        public void TraverseByAccessor_TooManyProperties_ShouldTruncateProperties()
        {
            var result = Traverse(() => new
                {
                    Prop1 = 1,
                    Prop2 = 1,
                    Prop3 = 1,
                    Prop4 = 1,
                    Prop5 = 1,
                    Prop6 = 1,
                    Prop7 = 1,
                },
                maxPropertiesCount: 5);

            Assert.That(result, Is.InstanceOf<ObjectPropertyValue>());

            var objectPropertyValue = (ObjectPropertyValue) result!;

            Assert.That(objectPropertyValue.NestedProperties.Length, Is.EqualTo(5));
            Assert.That(objectPropertyValue.PropertiesOverflow, Is.True);
        }

        [Test]
        public void TraverseByAccessor_FewProperties_ShouldNotTruncateProperties()
        {
            var result = Traverse(() => new
                {
                    Prop1 = 1,
                    Prop2 = 1,
                    Prop3 = 1
                },
                maxPropertiesCount: 3);

            Assert.That(result, Is.InstanceOf<ObjectPropertyValue>());

            var objectPropertyValue = (ObjectPropertyValue) result!;

            Assert.That(objectPropertyValue.NestedProperties.Length, Is.EqualTo(3));
            Assert.That(objectPropertyValue.PropertiesOverflow, Is.False);
        }

        [Test]
        public void TraverseByAccessor_Dictionary_ShouldTranslateToObject()
        {
            var result = Traverse(() => new Dictionary<string, object>
                {
                    { "1", 1 },
                    { "2", 1 }
                });

            Assert.That(result, Is.InstanceOf<ObjectPropertyValue>());

            var objectPropertyValue = (ObjectPropertyValue) result!;

            Assert.That(objectPropertyValue.NestedProperties.Length, Is.EqualTo(2));
            Assert.That(objectPropertyValue.PropertiesOverflow, Is.False);
        }

        [Test]
        public void TraverseByAccessor_DictionaryTooManyItems_ShouldTruncate()
        {
            var result = Traverse(() => new Dictionary<string, object>
                {
                    { "1", 1 },
                    { "2", 1 },
                    { "3", 1 }
                },
                maxPropertiesCount: 2);

            Assert.That(result, Is.InstanceOf<ObjectPropertyValue>());

            var objectPropertyValue = (ObjectPropertyValue) result!;

            Assert.That(objectPropertyValue.NestedProperties.Length, Is.EqualTo(2));
            Assert.That(objectPropertyValue.PropertiesOverflow, Is.True);
        }

        [Test]
        public void TraverseByAccessor_Enumerable_ShouldTranslateToEnumerableObject()
        {
            var result = Traverse(() => new List<int> { 1, 2, 3 });

            Assert.That(result, Is.InstanceOf<EnumerablePropertyValue>());

            var objectPropertyValue = (EnumerablePropertyValue) result!;

            Assert.That(objectPropertyValue.Items.Length, Is.EqualTo(3));
            Assert.That(objectPropertyValue.ItemsOverflow, Is.False);
        }

        [Test]
        public void TraverseByAccessor_EnumerableTooMany_ShouldTruncate()
        {
            var result = Traverse(() => new List<int> { 1, 2, 3 }, maxEnumerableLength: 2);

            Assert.That(result, Is.InstanceOf<EnumerablePropertyValue>());

            var objectPropertyValue = (EnumerablePropertyValue) result!;

            Assert.That(objectPropertyValue.Items.Length, Is.EqualTo(2));
            Assert.That(objectPropertyValue.ItemsOverflow, Is.True);
        }

        [Test]
        public void TraverseByAccessor_ObjectDeepLevel_ShouldTruncate()
        {
            var result = Traverse(() => new
            {
                Level1 = new
                {
                    Level2 = new
                    {
                        Level3 = "Test"
                    }
                }
            }, maxGraphDepth: 2);

            Assert.That(result, Is.InstanceOf<ObjectPropertyValue>());

            var objectPropertyValue = (ObjectPropertyValue) result!;

            Assert.That(objectPropertyValue.NestedProperties.Length, Is.EqualTo(1));

            var objectPropertyValueLevel2 = (ObjectPropertyValue) objectPropertyValue.NestedProperties[0].Value!;

            Assert.That(objectPropertyValueLevel2.NestedProperties[0].Value, Is.InstanceOf<EllipsisPropertyValue>());
        }

        [Test]
        public void TraverseByAccessor_ObjectNestedError_ShouldHandleAndReadRestProperties()
        {
            var result = Traverse(() => new SampleObject());

            Assert.That(result, Is.InstanceOf<ObjectPropertyValue>());

            var objectPropertyValue = (ObjectPropertyValue) result!;

            Assert.That(objectPropertyValue.NestedProperties.Length, Is.EqualTo(2));

            Assert.That(objectPropertyValue.NestedProperties[0].Title, Is.EqualTo("Prop1"));
            Assert.That(objectPropertyValue.NestedProperties[0].Value, Is.InstanceOf<SinglePropertyValue>());

            var nestedProperty = objectPropertyValue.NestedProperties[1];

            Assert.That(nestedProperty.Title, Is.EqualTo("Prop2"));
            Assert.That(nestedProperty.Value, Is.InstanceOf<ErrorPropertyValue>());
            Assert.That(((ErrorPropertyValue) nestedProperty.Value!).Message, Is.EqualTo("Error message"));
        }

        private PropertyValue? TraverseWithoutLimits(Func<object?> accessor)
        {
            return new ObjectTraverser(UnlimitedOptions).TraverseByAccessor(accessor);
        }

        private PropertyValue? Traverse(
            Func<object?> accessor, 
            int maxGraphDepth = int.MaxValue,
            int maxPropertiesCount = int.MaxValue,
            int maxEnumerableLength = int.MaxValue)
        {
            var options = new TraversingOptions(maxGraphDepth, maxPropertiesCount, maxEnumerableLength);
            return new ObjectTraverser(options).TraverseByAccessor(accessor);
        }
    }

    internal class SampleObject
    {
        public string Prop1 => "Value1";

        public string Prop2 => throw new Exception("Error message");
    }
}