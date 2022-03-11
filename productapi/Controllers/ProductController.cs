using Microsoft.AspNetCore.Mvc;
using productapi.Services;
using productapi.Models;

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
    public async Task<List<Product>> Get()
    {
        return await _productService.GetProductsAsync();
    }
}