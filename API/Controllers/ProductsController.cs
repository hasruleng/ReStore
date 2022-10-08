using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {// we going to use inside this controller is we're going to use DI to get our store context inside here
     // so that we've got access to the products table in our database.

        private readonly StoreContext _context;

        //in order to use dependency injection, we create a private field inside our class and assign that private fields to the context that we're adding in our constructor here.
        public ProductsController(StoreContext context)
        {
            _context = context;

        }

        [HttpGet]
        // public async Task<ActionResult<List<Product>>> GetProducts(string orderBy, string searchTerm, string brands, string types) 
        //^ typical rule of thumb if you have more than 3 or 4 parameters, just create an object to store these parameter 
        //FromQuery: what we want is these values as a query string on our get request
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams productParams)
        {
            //sort & search ini butuh using 'ProductExtensions' tapi uniknya ProductExtensions tdk ditulis scr eksplisit
            var query = _context.Products
            .Sort(productParams.OrderBy)
            .Search(productParams.SearchTerm)
            .Filter(productParams.Brands, productParams.Types)
            .AsQueryable();

            var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

            Response.AddPaginationHeader(products.MetaData);

            return products;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            return product;
        }


        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();
            return Ok(new { brands, types });
        }
    }
}