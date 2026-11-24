using System.ComponentModel.DataAnnotations;

namespace AbySalto.Mid.Application.Products.Dtos
{
    public sealed record CategoryDto(string Slug, int ProductCount);

    public sealed record ProductReviewDto(int Rating, string Comment, DateTime Date, string ReviewerName);

    public sealed record ProductDto(
        int Id,
        string Title,
        string Description,
        string Category,
        decimal Price,
        decimal DiscountPercentage,
        decimal Rating,
        int Stock,
        string? Brand,
        string? AvailabilityStatus,
        string? Thumbnail,
        IReadOnlyList<string> Images,
        IReadOnlyList<string> Tags,
        IReadOnlyList<ProductReviewDto> Reviews);

    public sealed class ProductQuery
    {
        public const int MaxPageSize = 100;

        [Range(1, int.MaxValue)]
        public int Page { get; init; } = 1;

        [Range(1, MaxPageSize)]
        public int PageSize { get; init; } = 20;

        public string? SortBy { get; init; }

        [RegularExpression("^(?i)(asc|desc)$", ErrorMessage = "Order must be 'asc' or 'desc'.")]
        public string? Order { get; init; }

        public string? Search { get; init; }

        public string? Category { get; init; }
    }
}
