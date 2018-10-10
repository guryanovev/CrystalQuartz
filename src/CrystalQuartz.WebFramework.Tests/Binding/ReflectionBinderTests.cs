namespace CrystalQuartz.WebFramework.Tests.Binding
{
    using CrystalQuartz.WebFramework.Binding;
    using NUnit.Framework;

    [TestFixture]
    public class ReflectionBinderTests
    {
        [Test]
        public void Bind_SimpleForm()
        {
            var binder = new ReflectionBinder();

            var request = new DictionaryRequest
            {
                ["JobKey"] = "test"
            };

            Form1 form = (Form1) binder.Bind(typeof(Form1), request);

            Assert.That(form, Is.Not.Null);
            Assert.That(form.JobKey, Is.EqualTo("test"));
        }

        [Test]
        public void Bind_NestedArray()
        {
            var binder = new ReflectionBinder();

            var request = new DictionaryRequest
            {
                ["Items[0].Key"] = "key1",
                ["Items[0].Value"] = "value1",
                ["Items[1].Key"] = "key2",
                ["Items[1].Value"] = "value2"
            };

            Form2 form = (Form2) binder.Bind(typeof(Form2), request);

            Assert.That(form, Is.Not.Null);
            Assert.That(form.Items, Is.Not.Null);
            Assert.That(form.Items.Length, Is.EqualTo(2));
            Assert.That(form.Items[0].Key, Is.EqualTo("key1"));
            Assert.That(form.Items[0].Value, Is.EqualTo("value1"));
            Assert.That(form.Items[1].Key, Is.EqualTo("key2"));
            Assert.That(form.Items[1].Value, Is.EqualTo("value2"));
        }

        [Test]
        public void Bind_NestedArray_ShouldBeCaseInsensitive()
        {
            var binder = new ReflectionBinder();

            var request = new DictionaryRequest
            {
                ["ITEMS[0].key"] = "key1"
            };

            Form2 form = (Form2) binder.Bind(typeof(Form2), request);

            Assert.That(form, Is.Not.Null);
            Assert.That(form.Items, Is.Not.Null);
            Assert.That(form.Items.Length, Is.EqualTo(1));
            Assert.That(form.Items[0].Key, Is.EqualTo("key1"));
        }

        [Test]
        public void Bind_NestedArrayWrongKey_ShouldIgnore()
        {
            var binder = new ReflectionBinder();

            var request = new DictionaryRequest
            {
                ["Items[0]"] = "key1",
                ["Items[0].Key"] = "key2"
            };

            Form2 form = (Form2) binder.Bind(typeof(Form2), request);

            Assert.That(form, Is.Not.Null);
            Assert.That(form.Items, Is.Not.Null);
            Assert.That(form.Items.Length, Is.EqualTo(1));
            Assert.That(form.Items[0].Key, Is.EqualTo("key2"));
        }
    }

    public class Form1
    {
        public string JobKey { get; set; }
    }

    public class Form2
    {
        public NestedModel[] Items { get; set; }
    }

    public class NestedModel
    {
        public string Key { get; set; }

        public string Value { get; set; }
    }
}