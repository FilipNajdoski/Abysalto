using System.Net;
using System.Net.Http.Json;
using AbySalto.Mid.Application.Products;
using AbySalto.Mid.Application.Products.Dtos;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace AbySalto.Mid.Infrastructure.ExternalServices.DummyJson
{
    public sealed class DummyJsonProductCatalog : IProductCatalog
    {
        private const string AllProductsCacheKey = "dummyjson:products:all";

        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _cache;
        private readonly DummyJsonOptions _options;

        public DummyJsonProductCatalog(HttpClient httpClient, IMemoryCache cache, IOptions<DummyJsonOptions> options)
        {
            _httpClient = httpClient;
            _cache = cache;
            _options = options.Value;
        }

        public async Task<IReadOnlyList<ProductDto>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            var products = await _cache.GetOrCreateAsync(AllProductsCacheKey, async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(_options.CacheMinutes);

                var response = await _httpClient.GetFromJsonAsync<DummyJsonProductsResponse>("products?limit=0", cancellationToken);

                return (IReadOnlyList<ProductDto>)(response?.Products.Select(Map).ToList() ?? []);
            });

            return products ?? [];
        }

        public async Task<ProductDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var cached = (await GetAllAsync(cancellationToken)).FirstOrDefault(p => p.Id == id);
            if (cached is not null)
            {
                return cached;
            }

            using var response = await _httpClient.GetAsync($"products/{id}", cancellationToken);
            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return null;
            }

            response.EnsureSuccessStatusCode();

            var product = await response.Content.ReadFromJsonAsync<DummyJsonProduct>(cancellationToken);
            return product is null ? null : Map(product);
        }

        private static ProductDto Map(DummyJsonProduct p) => new(
            p.Id,
            p.Title,
            p.Description,
            p.Category,
            p.Price,
            p.DiscountPercentage,
            p.Rating,
            p.Stock,
            p.Brand,
            p.AvailabilityStatus,
            p.Thumbnail,
            p.Images,
            p.Tags,
            p.Reviews.Select(r => new ProductReviewDto(r.Rating, r.Comment, r.Date, r.ReviewerName)).ToList());
    }
}
