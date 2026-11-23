using AbySalto.Mid.Application.Auth;
using AbySalto.Mid.Application.Auth.Dtos;
using AbySalto.Mid.Application.Common.Exceptions;
using AbySalto.Mid.Application.Common.Interfaces;
using AbySalto.Mid.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace AbySalto.Mid.Infrastructure.Authentication
{
    public sealed class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtTokenGenerator _tokenGenerator;
        private readonly ICurrentUserService _currentUser;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            IJwtTokenGenerator tokenGenerator,
            ICurrentUserService currentUser)
        {
            _userManager = userManager;
            _tokenGenerator = tokenGenerator;
            _currentUser = currentUser;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
        {
            if (await _userManager.FindByEmailAsync(request.Email) is not null)
            {
                throw new ConflictException($"User with email '{request.Email}' already exists.");
            }

            var user = new ApplicationUser
            {
                Email = request.Email,
                UserName = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors
                    .GroupBy(e => e.Code)
                    .ToDictionary(g => g.Key, g => g.Select(e => e.Description).ToArray());

                throw new ValidationException("Registration failed.", errors);
            }

            return CreateAuthResponse(user);
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user is null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                throw new UnauthorizedException("Invalid email or password.");
            }

            return CreateAuthResponse(user);
        }

        public async Task<UserDto> GetCurrentUserAsync(CancellationToken cancellationToken = default)
        {
            var userId = _currentUser.GetRequiredUserId();

            var user = await _userManager.FindByIdAsync(userId.ToString())
                ?? throw new NotFoundException("User not found.");

            return ToDto(user);
        }

        private AuthResponse CreateAuthResponse(ApplicationUser user)
        {
            var (token, expiresAt) = _tokenGenerator.Generate(user);
            return new AuthResponse(token, expiresAt, ToDto(user));
        }

        private static UserDto ToDto(ApplicationUser user) =>
            new(user.Id, user.Email ?? string.Empty, user.FirstName, user.LastName, user.CreatedAt);
    }
}
