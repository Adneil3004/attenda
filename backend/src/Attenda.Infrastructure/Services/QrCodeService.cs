using Attenda.Application.Common.Interfaces;
using QRCoder;

namespace Attenda.Infrastructure.Services;

public class QrCodeService : IQrCodeService
{
    public byte[] GenerateQrCode(string data)
    {
        using var qrGenerator = new QRCodeGenerator();
        using var qrCodeData = qrGenerator.CreateQrCode(data, QRCodeGenerator.ECCLevel.Q);
        using var qrCode = new PngByteQRCode(qrCodeData);
        return qrCode.GetGraphic(20);
    }
}
