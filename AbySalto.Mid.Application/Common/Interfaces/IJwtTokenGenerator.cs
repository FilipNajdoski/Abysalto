using AbySalto.Mid.Application.Auth.Dtos;

namespace AbySalto.Mid.Application.Common.Interfaces
{
    public interface IJwtTokenGenerator
    {
        AccessToken Generate(UserDto user);
    }

    public sealed record AccessToken(string Token, DateTime ExpiresAt);
}
