using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using productapi.Services;
using Microsoft.Extensions.Primitives;

[ApiController]
[Route("api/product")]
public class ProductController : ControllerBase
{
    private readonly ProductService _productService;

    public ProductController(ProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        // check the jwt-token.
        var headers = this.Request.Headers;
        StringValues stringValues;
        headers.TryGetValue("jwt", out stringValues);
        var jwtToken = stringValues.FirstOrDefault();

        if (_productService.verifyJWT(jwtToken) is false)
        {
            return Unauthorized();
        }

        return Ok(await _productService.GetProductsAsync());
    }
}