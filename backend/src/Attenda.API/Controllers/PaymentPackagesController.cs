using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Attenda.Infrastructure.Persistence;
using System.Text.Json;

namespace Attenda.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentPackagesController : ControllerBase
{
    private readonly AppDbContext _context;

    public PaymentPackagesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetPackages()
    {
        var packages = await _context.PaymentPackages
            .Where(p => p.IsActive)
            .OrderBy(p => p.Price)
            .Select(p => new PackageDto
            {
                Name = p.Name,
                Type = p.Type,
                Description = p.Description,
                GuestCount = p.GuestCount,
                Price = p.Price,
                Currency = p.Currency,
                HasDiscount = p.HasDiscount,
                DiscountPercentage = p.DiscountPercentage,
                FeaturesJson = p.Features
            })
            .ToListAsync();

        // Deserialize features for each package
        var result = packages.Select(p => new 
        {
            p.Name,
            p.Type,
            p.Description,
            p.GuestCount,
            p.Price,
            p.Currency,
            p.HasDiscount,
            p.DiscountPercentage,
            Features = string.IsNullOrEmpty(p.FeaturesJson) 
                ? new Dictionary<string, bool>() 
                : JsonSerializer.Deserialize<Dictionary<string, bool>>(p.FeaturesJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
        }).ToList();

        return Ok(result);
    }
}

public class PackageDto
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int GuestCount { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; } = "USD";
    public bool HasDiscount { get; set; }
    public int DiscountPercentage { get; set; }
    public string? FeaturesJson { get; set; }
}