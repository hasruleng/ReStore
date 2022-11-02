using System;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            _context = context;

        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket(GetBuyerId());
            if (basket == null) return NotFound();

            return basket.MapBasketToDto();
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            var basket = await RetrieveBasket(GetBuyerId());
            if (basket == null) basket = CreateBasket(); //if not exist, create basket
            var product = await _context.Products.FindAsync(productId); //get product

            if (product == null) return BadRequest(new ProblemDetails { Title = "Product not found" });

            basket.AddItem(product, quantity); //add item

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetBasket", basket.MapBasketToDto());

            //save changes
            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {

            var basket = await RetrieveBasket(GetBuyerId());//get basket
            if (basket == null) return NotFound();

            basket.RemoveItem(productId, quantity);//remove item or reduce quantity

            var result = await _context.SaveChangesAsync() > 0;//save changes

            if (result) return Ok();

            //save changes
            return BadRequest(new ProblemDetails { Title = "Problem removing item from basket" });

        }

        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if (string.IsNullOrEmpty(buyerId))
            { //kalau buyerIdnya tidak ada, maka
                Response.Cookies.Delete("buyerId");
                return null; //basket dinullkan 
            }
            return await _context.Baskets
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }

        private string GetBuyerId()
        { //we're going to have our username. 
            return User.Identity?.Name ?? Request.Cookies["buyerId"]; //If we don't have a username, then we're going to check to see if we've got a cookie
        }

        private Basket CreateBasket()
        {
            var buyerId = User.Identity?.Name; //kalau udah logged in harusnya dapat buyerId
            if (string.IsNullOrEmpty(buyerId))
            { //kalau masih kosong
                buyerId = Guid.NewGuid().ToString(); //bikin buyerId
                var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }

            var basket = new Basket { BuyerId = buyerId };
            _context.Baskets.Add(basket);
            return basket;
        }

        private BasketDto MapBasketToDto(Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand
                }).ToList()
            };
        }
    }

}