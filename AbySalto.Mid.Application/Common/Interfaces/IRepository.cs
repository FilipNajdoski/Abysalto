using AbySalto.Mid.Domain.Common;

namespace AbySalto.Mid.Application.Common.Interfaces
{
    public interface IRepository<TAggregate> where TAggregate : class, IAggregateRoot
    {
        Task AddAsync(TAggregate aggregate, CancellationToken cancellationToken = default);
    }
}
