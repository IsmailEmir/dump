using System.Security.Cryptography;

namespace WebApplication1.Infrastructure.Utils;

public static class PasswordHasher
{
    public static string Hash(string password)
    {
        var salt = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(salt);

        var hash = new Rfc2898DeriveBytes(password, salt, 100_000, HashAlgorithmName.SHA256).GetBytes(32);

        var hashBytes = new byte[64];
        Array.Copy(salt, 0, hashBytes, 0, 32);
        Array.Copy(hash, 0, hashBytes, 32, 32);

        return Convert.ToBase64String(hashBytes);
    }

    public static bool Verify(string password, string storedHash)
    {
        var hashBytes = Convert.FromBase64String(storedHash);
        var salt = new byte[32];
        Array.Copy(hashBytes, 0, salt, 0, 32);

        var hash = new Rfc2898DeriveBytes(password, salt, 100_000, HashAlgorithmName.SHA256).GetBytes(32);

        for (int i = 0; i < 32; i++)
            if (hash[i] != hashBytes[i + 32]) return false;

        return true;
    }
}