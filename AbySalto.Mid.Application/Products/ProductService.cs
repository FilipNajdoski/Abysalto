using AbySalto.Mid.Application.Common.Exceptions;
using AbySalto.Mid.Application.Common.Models;
using AbySalto.Mid.Application.Products.Dtos;

namespace AbySalto.Mid.Application.Products
{
    public sealed class ProductService : IProductService
    {
        private static readonly Dictionary<string, Func<ProductDto, object?>> SortSelectors = new(StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = p => p.Id,
            ["title"] = p => p.Title,
            ["price"] = p => p.Price,
            ["rating"] = p => p.Rating,
            ["stock"] = p => p.Stock,
            ["discountPercentage"] = p => p.DiscountPercentage,
            ["category"] = p => p.Category,
            ["brand"] = p => p.Brand
        };

        private readonly IProductCatalog _catalog;

        public ProductService(IProductCatalog catalog)
        {
            _catalog = catalog;
        }

        public async Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(CancellationToken cancellationToken = default)
        {
            var products = await _catalog.GetAllAsync(cancellationToken);

            return products
                .Where(p => !string.IsNullOrWhiteSpace(p.Category))
                .GroupBy(p => p.Category, StringComparer.OrdinalIgnoreCase)
                .Select(g => new CategoryDto(g.Key, g.Count()))
                .OrderBy(c => c.Slug, StringComparer.OrdinalIgnoreCase)
                .ToList();
        }

        public async Task<PagedResult<ProductDto>> GetProductsAsync(ProductQuery query, CancellationToken cancellationToken = default)
        {
            IEnumerable<ProductDto> products = await _catalog.GetAllAsync(cancellationToken);

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var term = query.Search.Trim();
                products = products.Where(p =>
                    p.Title.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                    p.Description.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                    (p.Brand?.Contains(term, StringComparison.OrdinalIgnoreCase) ?? false));
            }

            if (!string.IsNullOrWhiteSpace(query.Category))
            {
                products = products.Where(p => string.Equals(p.Category, query.Category.Trim(), StringComparison.OrdinalIgnoreCase));
            }

            products = ApplySorting(products, query.SortBy, query.Order);

            var filtered = products.ToList();
            var page = Math.Max(1, query.Page);
            var pageSize = Math.Clamp(query.PageSize, 1, ProductQuery.MaxPageSize);

            var items = filtered
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return new PagedResult<ProductDto>(items, page, pageSize, filtered.Count);
        }

        public async Task<ProductDto> GetProductAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _catalog.GetByIdAsync(id, cancellationToken)
                ?? throw new NotFoundException($"Product with id {id} was not found.");
        }

        private static IEnumerable<ProductDto> ApplySorting(IEnumerable<ProductDto> products, string? sortBy, string? order)
        {
            if (string.IsNullOrWhiteSpace(sortBy))
            {
                return products.OrderBy(p => p.Id);
            }

            if (!SortSelectors.TryGetValue(sortBy, out var selector))
            {
                throw new ValidationException(
                    $"Invalid sortBy '{sortBy}'.",
                    new Dictionary<string, string[]>
                    {
                        ["sortBy"] = [$"Allowed values: {string.Join(", ", SortSelectors.Keys)}."]
                    });
            }

            var descending = string.Equals(order, "desc", StringComparison.OrdinalIgnoreCase);

            return descending
                ? products.OrderByDescending(selector).ThenBy(p => p.Id)
                : products.OrderBy(selector).ThenBy(p => p.Id);
        }
    }
}
