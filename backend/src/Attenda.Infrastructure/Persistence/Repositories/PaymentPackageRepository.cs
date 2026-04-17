using Attenda.Domain.Aggregates;
using Attenda.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Attenda.Infrastructure.Persistence.Repositories;

public class PaymentPackageRepository : IPaymentPackageRepository
{
    private readonly AppDbContext _context;

    public PaymentPackageRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PaymentPackage?> GetByTypeAsync(string type, CancellationToken cancellationToken = default)
    {
        return await _context.PaymentPackages
            .FirstOrDefaultAsync(p => p.Type.ToLower() == type.ToLower() && p.IsActive, cancellationToken);
    }

    public async Task<List<PaymentPackage>> ListActiveAsync(CancellationToken cancellationToken = default)
    {
        return await _context.PaymentPackages
            .Where(p => p.IsActive)
            .OrderBy(p => p.Price)
            .ToListAsync(cancellationToken);
    }
}
