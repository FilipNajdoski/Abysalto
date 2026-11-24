using AbySalto.Mid.Application.Common.Interfaces;
using AbySalto.Mid.Domain.Entities;

namespace AbySalto.Mid.Application.Favorites
{
    public interface IFavoriteRepository : IRepository<Favorite>
    {
        Task<IReadOnlyList<Favorite>> GetByUserAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<Favorite?> GetAsync(Guid userId, int productId, CancellationToken cancellationToken = default);
        Task RemoveAsync(Favorite favorite, CancellationToken cancellationToken = default);
    }
}
