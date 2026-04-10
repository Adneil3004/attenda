namespace Attenda.Application.Common.Interfaces;

public interface IQrCodeService
{
    byte[] GenerateQrCode(string data);
}
