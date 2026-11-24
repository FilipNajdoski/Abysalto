using AbySalto.Mid.Application.Products.Dtos;

namespace AbySalto.Mid.Application.Favorites
{
    public sealed record FavoriteDto(int ProductId, DateTime AddedAt, ProductDto? Product);

    public interface IFavoriteService
    {
        Task<IReadOnlyList<FavoriteDto>> GetFavoritesAsync(CancellationToken cancellationToken = default);
        Task<FavoriteDto> AddFavoriteAsync(int productId, CancellationToken cancellationToken = default);
        Task RemoveFavoriteAsync(int productId, CancellationToken cancellationToken = default);
    }
}
