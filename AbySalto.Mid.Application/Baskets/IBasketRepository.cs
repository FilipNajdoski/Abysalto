using AbySalto.Mid.Domain.Entities;

namespace AbySalto.Mid.Application.Baskets
{
    public interface IBasketRepository
    {
        Task<Basket?> GetByUserAsync(Guid userId, CancellationToken cancellationToken = default);
        Task AddAsync(Basket basket, CancellationToken cancellationToken = default);
        Task SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
