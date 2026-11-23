using Microsoft.OpenApi.Models;

namespace AbySalto.Mid
{
    public static class DependencyInjection
    {
        public const string CorsPolicy = "Frontend";

        public static IServiceCollection AddPresentation(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddControllers();
            services.AddOpenApi();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "AbySalto", Version = "v1" });
            });

            return services;
        }
    }
}
