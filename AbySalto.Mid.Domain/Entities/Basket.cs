using AbySalto.Mid.Domain.Common;

namespace AbySalto.Mid.Domain.Entities
{
    public class Basket : IAggregateRoot
    {
        private readonly List<BasketItem> _items = [];

        public Guid Id { get; private set; }
        public Guid UserId { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }
        public IReadOnlyCollection<BasketItem> Items => _items.AsReadOnly();

        private Basket()
        {
        }

        public Basket(Guid userId)
        {
            Id = Guid.NewGuid();
            UserId = userId;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = CreatedAt;
        }

        public int GetQuantity(int productId) =>
            _items.FirstOrDefault(i => i.ProductId == productId)?.Quantity ?? 0;

        public BasketItem AddItem(int productId, int quantity, int availableStock)
        {
            if (quantity <= 0)
            {
                throw new DomainException("Quantity must be greater than zero.");
            }

            var item = _items.FirstOrDefault(i => i.ProductId == productId);
            var requestedTotal = (item?.Quantity ?? 0) + quantity;
            if (requestedTotal > availableStock)
            {
                throw new DomainException(
                    $"Requested total {requestedTotal} of product {productId} exceeds available stock {availableStock}.");
            }

            if (item is null)
            {
                item = new BasketItem(Id, productId, quantity);
                _items.Add(item);
            }
            else
            {
                item.IncreaseQuantity(quantity);
            }

            UpdatedAt = DateTime.UtcNow;
            return item;
        }

        public bool SetItemQuantity(int productId, int quantity, int availableStock)
        {
            if (quantity <= 0)
            {
                throw new DomainException("Quantity must be greater than zero.");
            }

            if (quantity > availableStock)
            {
                throw new DomainException(
                    $"Requested quantity {quantity} of product {productId} exceeds available stock {availableStock}.");
            }

            var item = _items.FirstOrDefault(i => i.ProductId == productId);
            if (item is null)
            {
                return false;
            }

            item.SetQuantity(quantity);
            UpdatedAt = DateTime.UtcNow;
            return true;
        }

        public bool RemoveItem(int productId)
        {
            var item = _items.FirstOrDefault(i => i.ProductId == productId);
            if (item is null)
            {
                return false;
            }

            _items.Remove(item);
            UpdatedAt = DateTime.UtcNow;
            return true;
        }
    }
}
