namespace AbySalto.Mid.Domain.Entities
{
    public class BasketItem
    {
        public Guid Id { get; private set; }
        public Guid BasketId { get; private set; }
        public int ProductId { get; private set; }
        public int Quantity { get; private set; }
        public DateTime AddedAt { get; private set; }

        private BasketItem()
        {
        }

        internal BasketItem(Guid basketId, int productId, int quantity)
        {
            if (productId <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(productId), "Product id must be positive.");
            }

            EnsurePositive(quantity);

            Id = Guid.NewGuid();
            BasketId = basketId;
            ProductId = productId;
            Quantity = quantity;
            AddedAt = DateTime.UtcNow;
        }

        internal void IncreaseQuantity(int quantity)
        {
            EnsurePositive(quantity);
            Quantity += quantity;
        }

        private static void EnsurePositive(int quantity)
        {
            if (quantity <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(quantity), "Quantity must be positive.");
            }
        }
    }
}
