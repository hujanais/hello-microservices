using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using userapi.Services;
using userapi.Models;

[ApiController]
[Route("api/users")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpGet]
    public async Task<List<User>> Get()
    {
        return await _authService.GetUsersAsync();
    }

    [HttpPost]
    public async Task<IActionResult> Post(LoginRequest loginRequest)
    {
        var user = await _authService.PostUsersAsync(loginRequest);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }
}