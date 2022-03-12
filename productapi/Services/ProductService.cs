using productapi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace productapi.Services;

public class ProductService
{
    private readonly IMongoCollection<Product> _productsCollection;
    private readonly IMongoCollection<User> _userCollection;

    public ProductService(IOptions<InfoStoreDatabaseSettings> dbSettings)
    {
        var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
        _productsCollection = mongoDatabase.GetCollection<Product>(dbSettings.Value.ProductCollectionName);
        _userCollection = mongoDatabase.GetCollection<User>(dbSettings.Value.UserCollectionName);
    }

    public bool verifyJWT(string? tokenId)
    {
        var users = _userCollection.Find(_ => true).ToList();
        return (_userCollection.Find(u => u.Jwt == tokenId).FirstOrDefault() is not null);
    }

    public async Task<List<Product>> GetProductsAsync()
    {
        return await _productsCollection.Find(_ => true).ToListAsync();
    }
}