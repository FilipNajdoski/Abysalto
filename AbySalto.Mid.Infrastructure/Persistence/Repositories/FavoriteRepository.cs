using AbySalto.Mid.Application.Favorites;
using AbySalto.Mid.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AbySalto.Mid.Infrastructure.Persistence.Repositories
{
    public sealed class FavoriteRepository : IFavoriteRepository
    {
        private readonly AppDbContext _context;

        public FavoriteRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<Favorite>> GetByUserAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.Favorites
                .AsNoTracking()
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public Task<Favorite?> GetAsync(Guid userId, int productId, CancellationToken cancellationToken = default)
        {
            return _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId, cancellationToken);
        }

        public async Task AddAsync(Favorite favorite, CancellationToken cancellationToken = default)
        {
            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task RemoveAsync(Favorite favorite, CancellationToken cancellationToken = default)
        {
            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
