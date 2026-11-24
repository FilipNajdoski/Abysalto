using AbySalto.Mid.Application.Baskets.Dtos;
using AbySalto.Mid.Application.Common.Exceptions;
using AbySalto.Mid.Application.Common.Interfaces;
using AbySalto.Mid.Application.Products;
using AbySalto.Mid.Domain.Entities;

namespace AbySalto.Mid.Application.Baskets
{
    public sealed class BasketService : IBasketService
    {
        private readonly IBasketRepository _repository;
        private readonly IProductCatalog _catalog;
        private readonly ICurrentUserService _currentUser;

        public BasketService(IBasketRepository repository, IProductCatalog catalog, ICurrentUserService currentUser)
        {
            _repository = repository;
            _catalog = catalog;
            _currentUser = currentUser;
        }

        public async Task<BasketDto> GetBasketAsync(CancellationToken cancellationToken = default)
        {
            var userId = _currentUser.GetRequiredUserId();
            var basket = await _repository.GetByUserAsync(userId, cancellationToken);

            return await ToDtoAsync(basket, cancellationToken);
        }

        public async Task<BasketDto> AddItemAsync(AddBasketItemRequest request, CancellationToken cancellationToken = default)
        {
            var userId = _currentUser.GetRequiredUserId();

            var product = await _catalog.GetByIdAsync(request.ProductId, cancellationToken)
                ?? throw new NotFoundException($"Product with id {request.ProductId} was not found.");

            var basket = await _repository.GetByUserAsync(userId, cancellationToken);
            var isNew = basket is null;
            basket ??= new Basket(userId);

            basket.AddItem(product.Id, request.Quantity, product.Stock);

            if (isNew)
            {
                await _repository.AddAsync(basket, cancellationToken);
            }
            else
            {
                await _repository.SaveChangesAsync(cancellationToken);
            }

            return await ToDtoAsync(basket, cancellationToken);
        }

        public async Task<BasketDto> SetItemQuantityAsync(int productId, SetBasketItemQuantityRequest request, CancellationToken cancellationToken = default)
        {
            var userId = _currentUser.GetRequiredUserId();

            var basket = await _repository.GetByUserAsync(userId, cancellationToken);
            if (basket is null || basket.GetQuantity(productId) == 0)
            {
                throw new NotFoundException($"Product {productId} is not in the basket.");
            }

            var product = await _catalog.GetByIdAsync(productId, cancellationToken)
                ?? throw new NotFoundException($"Product with id {productId} was not found.");

            basket.SetItemQuantity(productId, request.Quantity, product.Stock);
            await _repository.SaveChangesAsync(cancellationToken);

            return await ToDtoAsync(basket, cancellationToken);
        }

        public async Task<BasketDto> RemoveItemAsync(int productId, CancellationToken cancellationToken = default)
        {
            var userId = _currentUser.GetRequiredUserId();

            var basket = await _repository.GetByUserAsync(userId, cancellationToken);
            if (basket is null || !basket.RemoveItem(productId))
            {
                throw new NotFoundException($"Product {productId} is not in the basket.");
            }

            await _repository.SaveChangesAsync(cancellationToken);

            return await ToDtoAsync(basket, cancellationToken);
        }

        private async Task<BasketDto> ToDtoAsync(Basket? basket, CancellationToken cancellationToken)
        {
            if (basket is null || basket.Items.Count == 0)
            {
                return new BasketDto([], 0, 0m, basket?.UpdatedAt);
            }

            var products = (await _catalog.GetAllAsync(cancellationToken)).ToDictionary(p => p.Id);

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
