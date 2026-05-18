namespace WebApplication1.Domain.Interfaces.Services;

public interface IFileStorageService
{
    Task<string?> SaveFileAsync(IFormFile? file, string folderName);
    Task DeleteFileAsync(string filePath);
}

