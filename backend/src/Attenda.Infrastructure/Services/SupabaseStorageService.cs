using Attenda.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;
using Supabase;

namespace Attenda.Infrastructure.Services;

public class SupabaseStorageService : IImageStorageService
{
    private readonly Client _supabaseClient;
    private readonly string _bucketName;

    public SupabaseStorageService(Client supabaseClient, IConfiguration configuration)
    {
        _supabaseClient = supabaseClient;
        _bucketName = configuration["Supabase:Bucket"] ?? "event-images";
    }

    public async Task<string> UploadImageAsync(Stream imageStream, string fileName, CancellationToken ct = default)
    {
        // 0. Ensure Supabase is initialized
        await _supabaseClient.InitializeAsync();

        // 1. Process Image
        using var image = await Image.LoadAsync(imageStream, ct);
        
        // Resize if too large (max 1920)
        int maxWidth = 1920;
        int maxHeight = 1080;
        if (image.Width > maxWidth || image.Height > maxHeight)
        {
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new Size(maxWidth, maxHeight),
                Mode = ResizeMode.Max
            }));
        }

        using var outputStream = new MemoryStream();
        // Save as JPEG with 75% quality to ensure < 1MB
        var encoder = new JpegEncoder { Quality = 75 };
        await image.SaveAsJpegAsync(outputStream, encoder, ct);
        
        var bytes = outputStream.ToArray();

        // 2. Upload to Supabase
        var storage = _supabaseClient.Storage.From(_bucketName);
        
        // Generate a unique path/filename
        var extension = Path.GetExtension(fileName);
        if (string.IsNullOrEmpty(extension)) extension = ".jpg";
        
        var finalFileName = $"{Guid.NewGuid()}{extension}";

        await storage.Upload(bytes, finalFileName, new Supabase.Storage.FileOptions
        {
            ContentType = "image/jpeg",
            Upsert = true
        });

        // 3. Return Public URL
        return storage.GetPublicUrl(finalFileName);
    }
}
