using productapi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace productapi.Services;

public class ProductService
{
    private readonly IMongoCollection<Product> _productsCollection;

    public ProductService(IOptions<InfoStoreDatabaseSettings> dbSettings)
    {
        var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
        _productsCollection = mongoDatabase.GetCollection<Product>(dbSettings.Value.ProductCollectionName);
    }

    public async Task<List<Product>> GetProductsAsync() => await _productsCollection.Find(_ => true).ToListAsync();

}