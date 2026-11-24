using AbySalto.Mid.Application.Baskets;
using AbySalto.Mid.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AbySalto.Mid.Infrastructure.Persistence.Repositories
{
    public sealed class BasketRepository : IBasketRepository
    {
        private readonly AppDbContext _context;

        public BasketRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<Basket?> GetByUserAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return _context.Baskets
                .Include(b => b.Items)
                .FirstOrDefaultAsync(b => b.UserId == userId, cancellationToken);
        }

        public async Task AddAsync(Basket basket, CancellationToken cancellationToken = default)
        {
            _context.Baskets.Add(basket);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public Task SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return _context.SaveChangesAsync(cancellationToken);
        }
    }
}
