using Attenda.Domain.Aggregates;

namespace Attenda.Domain.Interfaces;

public interface IPaymentPackageRepository
{
    Task<PaymentPackage?> GetByTypeAsync(string type, CancellationToken cancellationToken = default);
    Task<List<PaymentPackage>> ListActiveAsync(CancellationToken cancellationToken = default);
}
