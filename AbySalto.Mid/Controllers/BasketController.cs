using AbySalto.Mid.Application.Baskets;
using AbySalto.Mid.Application.Baskets.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AbySalto.Mid.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/basket")]
    public class BasketController : ControllerBase
    {
        private readonly IBasketService _basketService;

        public BasketController(IBasketService basketService)
        {
            _basketService = basketService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(BasketDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<BasketDto>> Get(CancellationToken cancellationToken)
        {
            return Ok(await _basketService.GetBasketAsync(cancellationToken));
        }

        [HttpPost("items")]
        [ProducesResponseType(typeof(BasketDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BasketDto>> AddItem(AddBasketItemRequest request, CancellationToken cancellationToken)
        {
            return Ok(await _basketService.AddItemAsync(request, cancellationToken));
        }

        [HttpDelete("items/{productId:int}")]
        [ProducesResponseType(typeof(BasketDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BasketDto>> RemoveItem(int productId, CancellationToken cancellationToken)
        {
            return Ok(await _basketService.RemoveItemAsync(productId, cancellationToken));
        }
    }
}
