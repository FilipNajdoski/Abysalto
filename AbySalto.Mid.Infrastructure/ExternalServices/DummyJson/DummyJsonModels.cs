namespace AbySalto.Mid.Infrastructure.ExternalServices.DummyJson
{
    internal sealed class DummyJsonProductsResponse
    {
        public List<DummyJsonProduct> Products { get; init; } = [];
        public int Total { get; init; }
        public int Skip { get; init; }
        public int Limit { get; init; }
    }

    internal sealed class DummyJsonProduct
    {
        public int Id { get; init; }
        public string Title { get; init; } = string.Empty;
        public string Description { get; init; } = string.Empty;
        public string Category { get; init; } = string.Empty;
        public decimal Price { get; init; }
        public decimal DiscountPercentage { get; init; }
        public decimal Rating { get; init; }
        public int Stock { get; init; }
        public string? Brand { get; init; }
        public string? AvailabilityStatus { get; init; }
        public string? Thumbnail { get; init; }
        public List<string> Images { get; init; } = [];
        public List<string> Tags { get; init; } = [];
        public List<DummyJsonReview> Reviews { get; init; } = [];
    }

    internal sealed class DummyJsonReview
    {
        public int Rating { get; init; }
        public string Comment { get; init; } = string.Empty;
        public DateTime Date { get; init; }
        public string ReviewerName { get; init; } = string.Empty;
    }
}
