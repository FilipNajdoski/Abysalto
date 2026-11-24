using AbySalto.Mid.Application.Auth;
using AbySalto.Mid.Application.Baskets;
using AbySalto.Mid.Application.Favorites;
using AbySalto.Mid.Application.Products;
using Microsoft.Extensions.DependencyInjection;
namespace AbySalto.Mid.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IProductLookup, ProductLookup>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IFavoriteService, FavoriteService>();
            services.AddScoped<IBasketService, BasketService>();

            return services;
        }
    }
}
