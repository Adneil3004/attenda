namespace Attenda.Application.Common.Interfaces;

public interface IImageStorageService
{
    /// <summary>
    /// Processes (resizes and compresses) and uploads an image to a permanent storage.
    /// </summary>
    /// <param name="imageStream">The stream containing the original image.</param>
    /// <param name="fileName">The suggested file name.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>The public URL of the uploaded image.</returns>
    Task<string> UploadImageAsync(Stream imageStream, string fileName, CancellationToken ct = default);
}
