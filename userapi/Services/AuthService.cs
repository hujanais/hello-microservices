using userapi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace userapi.Services;

public class AuthService
{
    private readonly IMongoCollection<User> _usersCollection;

    public AuthService(IOptions<UsersDatabaseSettings> dbSettings)
    {
        var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
        _usersCollection = mongoDatabase.GetCollection<User>(dbSettings.Value.UserCollectionName);
    }

    public async Task<List<User>> GetUsersAsync() => await _usersCollection.Find(_ => true).ToListAsync();

    public async Task<User> PostUsersAsync(LoginRequest loginReq)
    {
        return await _usersCollection.Find(u => u.Username == loginReq.Username && u.Password == loginReq.Password).FirstOrDefaultAsync();
    }
}