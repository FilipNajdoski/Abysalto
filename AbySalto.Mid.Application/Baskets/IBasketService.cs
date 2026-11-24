using AbySalto.Mid.Application.Baskets.Dtos;

namespace AbySalto.Mid.Application.Baskets
{
    public interface IBasketService
    {
        Task<BasketDto> GetBasketAsync(CancellationToken cancellationToken = default);
        Task<BasketDto> AddItemAsync(AddBasketItemRequest request, CancellationToken cancellationToken = default);
        Task<BasketDto> SetItemQuantityAsync(int productId, SetBasketItemQuantityRequest request, CancellationToken cancellationToken = default);
        Task<BasketDto> RemoveItemAsync(int productId, CancellationToken cancellationToken = default);
    }
}
