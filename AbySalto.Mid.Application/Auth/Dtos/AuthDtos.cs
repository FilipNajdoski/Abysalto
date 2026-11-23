using System.ComponentModel.DataAnnotations;

namespace AbySalto.Mid.Application.Auth.Dtos
{
    public sealed class RegisterRequest
    {
        [Required, EmailAddress, MaxLength(256)]
        public string Email { get; init; } = string.Empty;

        [Required, MinLength(6), MaxLength(100)]
        public string Password { get; init; } = string.Empty;

        [Required, MaxLength(100)]
        public string FirstName { get; init; } = string.Empty;

        [Required, MaxLength(100)]
        public string LastName { get; init; } = string.Empty;
    }

    public sealed class LoginRequest
    {
        [Required, EmailAddress]
        public string Email { get; init; } = string.Empty;

        [Required]
        public string Password { get; init; } = string.Empty;
    }

    public sealed record UserDto(Guid Id, string Email, string FirstName, string LastName, DateTime CreatedAt);

    public sealed record AuthResponse(string Token, DateTime ExpiresAt, UserDto User);
}
