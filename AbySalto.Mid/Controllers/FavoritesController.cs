using AbySalto.Mid.Application.Favorites;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AbySalto.Mid.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/favorites")]
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;

        public FavoritesController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IReadOnlyList<FavoriteDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IReadOnlyList<FavoriteDto>>> GetAll(CancellationToken cancellationToken)
        {
            return Ok(await _favoriteService.GetFavoritesAsync(cancellationToken));
        }

        [HttpPost("{productId:int}")]
        [ProducesResponseType(typeof(FavoriteDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
        public async Task<ActionResult<FavoriteDto>> Add(int productId, CancellationToken cancellationToken)
        {
            return Ok(await _favoriteService.AddFavoriteAsync(productId, cancellationToken));
        }

        [HttpDelete("{productId:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Remove(int productId, CancellationToken cancellationToken)
        {
            await _favoriteService.RemoveFavoriteAsync(productId, cancellationToken);
            return NoContent();
        }
    }
}
