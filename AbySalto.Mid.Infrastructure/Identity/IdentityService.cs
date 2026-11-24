using AbySalto.Mid.Application.Auth.Dtos;
using AbySalto.Mid.Application.Common.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace AbySalto.Mid.Infrastructure.Identity
{
    public sealed class IdentityService : IIdentityService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public IdentityService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default)
        {
            return await _userManager.FindByEmailAsync(email) is not null;
        }

        public async Task<CreateUserResult> CreateUserAsync(NewUser newUser, string password, CancellationToken cancellationToken = default)
        {
            var user = new ApplicationUser
            {
                Email = newUser.Email,
                UserName = newUser.Email,
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                var errors = result.Errors
                    .GroupBy(e => e.Code)
                    .ToDictionary(g => g.Key, g => g.Select(e => e.Description).ToArray());

                return CreateUserResult.Failure(errors);
            }

            return CreateUserResult.Success(ToDto(user));
        }

        public async Task<UserDto?> ValidateCredentialsAsync(string email, string password, CancellationToken cancellationToken = default)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user is null || !await _userManager.CheckPasswordAsync(user, password))
            {
                return null;
            }

            return ToDto(user);
        }

        public async Task<UserDto?> GetByIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            return user is null ? null : ToDto(user);
        }

        private static UserDto ToDto(ApplicationUser user) =>
            new(user.Id, user.Email ?? string.Empty, user.FirstName, user.LastName, user.CreatedAt);
    }
}
