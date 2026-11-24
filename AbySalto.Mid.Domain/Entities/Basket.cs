namespace AbySalto.Mid.Domain.Entities
{
    public class Basket
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

        public BasketItem AddItem(int productId, int quantity)
        {
            var item = _items.FirstOrDefault(i => i.ProductId == productId);
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
