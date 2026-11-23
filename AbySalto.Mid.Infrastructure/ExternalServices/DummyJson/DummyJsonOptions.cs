namespace AbySalto.Mid.Infrastructure.ExternalServices.DummyJson
{
    public sealed class DummyJsonOptions
    {
        public const string SectionName = "DummyJson";

        public string BaseUrl { get; init; } = "https://dummyjson.com/";
        public int CacheMinutes { get; init; } = 10;
    }
}
