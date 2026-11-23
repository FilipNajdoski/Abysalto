namespace AbySalto.Mid.Application.Common.Interfaces
{
    public interface ICurrentUserService
    {
        Guid? UserId { get; }

        Guid GetRequiredUserId();
    }
}
