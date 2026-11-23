using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AbySalto.Mid.Application.Common.Exceptions;
using AbySalto.Mid.Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;

namespace AbySalto.Mid.Infrastructure.Authentication
{
    public sealed class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid? UserId
        {
            get
            {
                var user = _httpContextAccessor.HttpContext?.User;
                var value = user?.FindFirstValue(JwtRegisteredClaimNames.Sub)
                    ?? user?.FindFirstValue(ClaimTypes.NameIdentifier);

                return Guid.TryParse(value, out var id) ? id : null;
            }
        }

        public Guid GetRequiredUserId()
        {
            return UserId ?? throw new UnauthorizedException("User is not authenticated.");
        }
    }
}
