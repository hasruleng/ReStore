/*
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;//*/
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : DbContext //DbContext is already a combination of UnitofWork and Repository patterns.
    {
        public StoreContext(DbContextOptions options) : base(options) //the options will be the database connection strings
        {

        }

        public DbSet<Product> Products { get; set; } //"Products" will be the name of the table that will get created
    }
}