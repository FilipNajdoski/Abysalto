using AbySalto.Mid.Application.Auth.Dtos;
using AbySalto.Mid.Application.Common.Exceptions;
using AbySalto.Mid.Application.Common.Interfaces;

namespace AbySalto.Mid.Application.Auth
{
    public sealed class AuthService : IAuthService
    {
        private readonly IIdentityService _identityService;
        private readonly IJwtTokenGenerator _tokenGenerator;
        private readonly ICurrentUserService _currentUser;

        public AuthService(
            IIdentityService identityService,
            IJwtTokenGenerator tokenGenerator,
            ICurrentUserService currentUser)
        {
            _identityService = identityService;
            _tokenGenerator = tokenGenerator;
            _currentUser = currentUser;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
        {
            if (await _identityService.EmailExistsAsync(request.Email, cancellationToken))
            {
                throw new ConflictException($"User with email '{request.Email}' already exists.");
            }

            var result = await _identityService.CreateUserAsync(
                new NewUser(request.Email, request.FirstName, request.LastName),
                request.Password,
                cancellationToken);

            if (!result.Succeeded)
            {
                throw new ValidationException("Registration failed.", result.Errors.ToDictionary());
            }

            return CreateAuthResponse(result.User!);
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
        {
            var user = await _identityService.ValidateCredentialsAsync(request.Email, request.Password, cancellationToken)
                ?? throw new UnauthorizedException("Invalid email or password.");

            return CreateAuthResponse(user);
        }

        public async Task<UserDto> GetCurrentUserAsync(CancellationToken cancellationToken = default)
        {
            var userId = _currentUser.GetRequiredUserId();

            return await _identityService.GetByIdAsync(userId, cancellationToken)
                ?? throw new NotFoundException("User not found.");
        }

        private AuthResponse CreateAuthResponse(UserDto user)
        {
            var token = _tokenGenerator.Generate(user);
            return new AuthResponse(token.Token, token.ExpiresAt, user);
        }
    }
}
