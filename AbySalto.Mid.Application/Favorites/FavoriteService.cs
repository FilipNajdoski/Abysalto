using AbySalto.Mid.Application.Common.Exceptions;
using AbySalto.Mid.Application.Common.Interfaces;
using AbySalto.Mid.Application.Products;
using AbySalto.Mid.Domain.Entities;

namespace AbySalto.Mid.Application.Favorites
{
    public sealed class FavoriteService : IFavoriteService
    {
        private readonly IFavoriteRepository _repository;
        private readonly IProductCatalog _catalog;
        private readonly IProductLookup _productLookup;
        private readonly ICurrentUserService _currentUser;

        public FavoriteService(IFavoriteRepository repository, IProductCatalog catalog, IProductLookup productLookup, ICurrentUserService currentUser)
        {
            _repository = repository;
            _catalog = catalog;
            _productLookup = productLookup;
            _currentUser = currentUser;
        }

        public async Task<IReadOnlyList<FavoriteDto>> GetFavoritesAsync(CancellationToken cancellationToken = default)
        {
            var userId = _currentUser.GetRequiredUserId();
            var favorites = await _repository.GetByUserAsync(userId, cancellationToken);
            var products = await _productLookup.GetByIdsAsync(favorites.Select(f => f.ProductId), cancellationToken);

            return favorites
                .Select(f => new FavoriteDto(f.ProductId, f.CreatedAt, products.GetValueOrDefault(f.ProductId)))
                .ToList();
        }

        public async Task<FavoriteDto> AddFavoriteAsync(int productId, CancellationToken cancellationToken = default)
        {
            var userId = _currentUser.GetRequiredUserId();

            var product = await _catalog.GetByIdAsync(productId, cancellationToken)
                ?? throw new NotFoundException($"Product with id {productId} was not found.");

            if (await _repository.GetAsync(userId, productId, cancellationToken) is not null)
            {
                throw new ConflictException($"Product {productId} is already in favorites.");
            }

            var favorite = new Favorite(userId, productId);
            await _repository.AddAsync(favorite, cancellationToken);

            return new FavoriteDto(favorite.ProductId, favorite.CreatedAt, product);
        }

        public async Task RemoveFavoriteAsync(int productId, CancellationToken cancellationToken = default)
        {
            var userId = _currentUser.GetRequiredUserId();

            var favorite = await _repository.GetAsync(userId, productId, cancellationToken)
                ?? throw new NotFoundException($"Product {productId} is not in favorites.");

            await _repository.RemoveAsync(favorite, cancellationToken);
        }
    }
}
