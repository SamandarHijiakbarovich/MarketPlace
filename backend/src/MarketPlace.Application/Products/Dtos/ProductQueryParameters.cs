namespace MarketPlace.Application.Products.Dtos;

public class ProductQueryParameters
{
    public string? Search { get; set; }
    public int? CategoryId { get; set; }

    /// <summary>"price" yoki "name"</summary>
    public string? SortBy { get; set; }
    public bool Descending { get; set; }

    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 12;
}
