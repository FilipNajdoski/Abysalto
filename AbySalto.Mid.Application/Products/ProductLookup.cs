using AbySalto.Mid.Application.Products.Dtos;

namespace AbySalto.Mid.Application.Products
{
    public interface IProductLookup
    {
        Task<IReadOnlyDictionary<int, ProductDto>> GetByIdsAsync(IEnumerable<int> ids, CancellationToken cancellationToken = default);
    }

    public sealed class ProductLookup : IProductLookup
    {
        private readonly IProductCatalog _catalog;

        public ProductLookup(IProductCatalog catalog)
        {
            _catalog = catalog;
        }

        public async Task<IReadOnlyDictionary<int, ProductDto>> GetByIdsAsync(IEnumerable<int> ids, CancellationToken cancellationToken = default)
        {
            var wanted = ids.ToHashSet();
            if (wanted.Count == 0)
            {
                return new Dictionary<int, ProductDto>();
            }

            var products = await _catalog.GetAllAsync(cancellationToken);

            return products
                .Where(p => wanted.Contains(p.Id))
                .ToDictionary(p => p.Id);
        }
    }
}
