using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace productapi.Models;

public class Product
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public bool Discontinued { get; set; }
    public bool Ethernet { get; set; }

    public string? Family { get; set; }

    public string? GPIO { get; set; }

    public string? Memory { get; set; }

    public string? Model { get; set; }

    public string? Released { get; set; }

    public string? SoC { get; set; }

    public bool Wireless { get; set; }
}
