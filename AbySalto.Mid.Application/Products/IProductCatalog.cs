using AbySalto.Mid.Application.Products.Dtos;

namespace AbySalto.Mid.Application.Products
{
    public interface IProductCatalog
    {
        Task<IReadOnlyList<ProductDto>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<ProductDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    }
}
