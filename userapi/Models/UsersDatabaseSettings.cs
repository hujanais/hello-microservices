namespace userapi.Models;

public class UsersDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DatabaseName { get; set; } = null!;

    public string ProductCollectionName { get; set; } = null!;

    public string UserCollectionName { get; set; } = null!;
}