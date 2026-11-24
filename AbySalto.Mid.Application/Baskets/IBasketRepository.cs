using AbySalto.Mid.Application.Common.Interfaces;
using AbySalto.Mid.Domain.Entities;

namespace AbySalto.Mid.Application.Baskets
{
    public interface IBasketRepository : IRepository<Basket>
    {
        Task<Basket?> GetByUserAsync(Guid userId, CancellationToken cancellationToken = default);
        Task SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
