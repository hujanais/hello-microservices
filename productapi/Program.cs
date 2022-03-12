using productapi.Models;
using productapi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// adding mongodb support.
builder.Services.Configure<InfoStoreDatabaseSettings>(builder.Configuration.GetSection("ProductDatabase"));

// inject ProductService.
builder.Services.AddSingleton<ProductService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
