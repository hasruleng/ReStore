/*
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;//*/
using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : IdentityDbContext<User, Role, int> //DbContext is already a combination of UnitofWork and Repository patterns.
    {
        public StoreContext(DbContextOptions options) : base(options) //the options will be the database connection strings
        {
        }

        public DbSet<Product> Products { get; set; } //"Products" will be the name of the table that will get created

        public DbSet<Basket> Baskets { get; set; }
        public DbSet<Order> Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>()
                .HasOne(a => a.Address)
                .WithOne()
                .HasForeignKey<UserAddress>(a=>a.Id)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Role>() //this is gonna happen inside our migration (jalan di awal)
                .HasData(
                    new Role{Id=1, Name = "Member", NormalizedName = "MEMBER"},
                    new Role{Id=2, Name = "Admin", NormalizedName = "ADMIN"}
                );
        }
    }
}