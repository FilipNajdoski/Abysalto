using AbySalto.Mid.Application.Common.Models;
using AbySalto.Mid.Application.Products;
using AbySalto.Mid.Application.Products.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace AbySalto.Mid.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(PagedResult<ProductDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PagedResult<ProductDto>>> GetAll([FromQuery] ProductQuery query, CancellationToken cancellationToken)
        {
            return Ok(await _productService.GetProductsAsync(query, cancellationToken));
        }

        [HttpGet("categories")]
        [ProducesResponseType(typeof(IReadOnlyList<CategoryDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IReadOnlyList<CategoryDto>>> GetCategories(CancellationToken cancellationToken)
        {
            return Ok(await _productService.GetCategoriesAsync(cancellationToken));
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductDto>> GetById(int id, CancellationToken cancellationToken)
        {
            return Ok(await _productService.GetProductAsync(id, cancellationToken));
        }
    }
}
