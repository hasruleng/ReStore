
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{
    [Owned]
    public class ProductItemOrdered //previous orders
    {
        public int ProductId { get; set; }
        public string name { get; set; }
        public string PictureUrl { get; set; }
    }
}