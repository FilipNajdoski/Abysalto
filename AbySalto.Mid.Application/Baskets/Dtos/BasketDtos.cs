using System.ComponentModel.DataAnnotations;

namespace AbySalto.Mid.Application.Baskets.Dtos
{
    public sealed class AddBasketItemRequest
    {
        [Range(1, int.MaxValue)]
        public int ProductId { get; init; }

        [Range(1, 100)]
        public int Quantity { get; init; } = 1;
    }

    public sealed record BasketItemDto(
        int ProductId,
        string Title,
        string? Thumbnail,
        decimal UnitPrice,
        int Quantity,
        decimal LineTotal,
        DateTime AddedAt,
        bool IsAvailable);

    public sealed record BasketDto(IReadOnlyList<BasketItemDto> Items, int TotalQuantity, decimal Total, DateTime? UpdatedAt);
}
