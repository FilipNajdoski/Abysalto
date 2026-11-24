using AbySalto.Mid.Domain.Common;

namespace AbySalto.Mid.Domain.Entities
{
    public class Favorite : IAggregateRoot
    {
        public Guid Id { get; private set; }
        public Guid UserId { get; private set; }
        public int ProductId { get; private set; }
        public DateTime CreatedAt { get; private set; }

        private Favorite()
        {
        }

        public Favorite(Guid userId, int productId)
        {
            if (productId <= 0)
            {
                throw new DomainException("Product id must be positive.");
            }

            Id = Guid.NewGuid();
            UserId = userId;
            ProductId = productId;
            CreatedAt = DateTime.UtcNow;
        }
    }
}
