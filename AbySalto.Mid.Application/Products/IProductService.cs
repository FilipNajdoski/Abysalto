using AbySalto.Mid.Application.Common.Models;
using AbySalto.Mid.Application.Products.Dtos;

namespace AbySalto.Mid.Application.Products
{
    public interface IProductService
    {
        Task<PagedResult<ProductDto>> GetProductsAsync(ProductQuery query, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(CancellationToken cancellationToken = default);
        Task<ProductDto> GetProductAsync(int id, CancellationToken cancellationToken = default);
    }
}
