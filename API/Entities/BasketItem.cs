using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography.X509Certificates;

namespace API.Entities
{
    [Table("BasketItems")]
    public class BasketItem
    {
        public int id { get; set; }
        public int Quantity { get; set; }
        
        //navigation properties
        public int ProductId { get; set; }

        public Product Product { get; set; } //BasketItem has one-on-one relationship with product
        
        public int BasketId { get;set; }
        public Basket Basket { get; set; }
    }
}