using AbySalto.Mid.Application.Auth.Dtos;

namespace AbySalto.Mid.Application.Common.Interfaces
{
    public interface IIdentityService
    {
        Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default);
        Task<CreateUserResult> CreateUserAsync(NewUser user, string password, CancellationToken cancellationToken = default);
        Task<UserDto?> ValidateCredentialsAsync(string email, string password, CancellationToken cancellationToken = default);
        Task<UserDto?> GetByIdAsync(Guid userId, CancellationToken cancellationToken = default);
    }

    public sealed record NewUser(string Email, string FirstName, string LastName);

    public sealed record CreateUserResult(UserDto? User, IReadOnlyDictionary<string, string[]> Errors)
    {
        public bool Succeeded => User is not null;

        public static CreateUserResult Success(UserDto user) => new(user, new Dictionary<string, string[]>());

        public static CreateUserResult Failure(IReadOnlyDictionary<string, string[]> errors) => new(null, errors);
    }
}
