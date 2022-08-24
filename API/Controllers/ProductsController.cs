using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController:BaseApiController
    {// we going to use inside this controller is we're going to use DI to get our store context inside here
    // so that we've got access to the products table in our database.
        
        private readonly StoreContext _context;

        //in order to use dependency injection, we create a private field inside our class and assign that private fields to the context that we're adding in our constructor here.
        public ProductsController(StoreContext context)
        {
            _context = context;

        }
   
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        [HttpGet("{id}")]   
        public async Task<ActionResult<Product>> GetProduct(int id){
            var product = await _context.Products.FindAsync(id);
            if (product==null)
                return NotFound();
                
            return product;
        }

        // [HttpGet]
        // public ActionResult<List<Product>> GetProducts(){
        //     var products=context.Products.ToList();
        //     return Ok(products);
        // }
        // [HttpGet("{id}")]   
        // public ActionResult<Product> GetProduct(int id){
        //     return context.Products.Find(id);
        // }
    }
}