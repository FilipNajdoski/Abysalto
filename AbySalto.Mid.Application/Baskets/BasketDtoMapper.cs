using AbySalto.Mid.Application.Baskets.Dtos;
using AbySalto.Mid.Application.Products.Dtos;
using AbySalto.Mid.Domain.Entities;

namespace AbySalto.Mid.Application.Baskets
{
    internal static class BasketDtoMapper
    {
        public static BasketDto Empty(DateTime? updatedAt) => new([], 0, 0m, updatedAt);

        public static BasketDto ToDto(Basket basket, IReadOnlyDictionary<int, ProductDto> products)
        {
            var items = basket.Items
                .OrderBy(i => i.AddedAt)
                .Select(i =>
                {
                    var product = products.GetValueOrDefault(i.ProductId);
                    var unitPrice = product?.Price ?? 0m;

                    return new BasketItemDto(
                        i.ProductId,
                        product?.Title ?? $"Product {i.ProductId}",
                        product?.Thumbnail,
                        unitPrice,
                        i.Quantity,
                        unitPrice * i.Quantity,
                        i.AddedAt,
                        product is not null);
                })
                .ToList();

            return new BasketDto(items, items.Sum(i => i.Quantity), items.Sum(i => i.LineTotal), basket.UpdatedAt);
        }
    }
}
