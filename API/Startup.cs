using System.Text;
using API.Data;
using API.Entities;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Collections.Generic;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        { //inject things into clasess, so it/they are available to access inside class
            Configuration = configuration; //what being injected is some configuration settings, e.g.: connection strings
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services) // a.k.a Dependency Injection container as we build up our classes in our app.
        {

            services.AddControllers();
            services.AddSwaggerGen(c => //these all are boiler plate to make swagger happy
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });
                c.AddSecurityDefinition("Bearer",new OpenApiSecurityScheme
                {
                    Description = "Jwt Auth Bearer",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type  = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header
                        },
                        new List<string>()
                    }
                });
            });
            services.AddDbContext<StoreContext>(opt =>
            {
                opt.UseNpgsql(Configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddCors();
            services.AddIdentityCore<User>(opt =>
                {
                    opt.User.RequireUniqueEmail = true;
                }
            )
                .AddRoles<Role>()
                .AddEntityFrameworkStores<StoreContext>();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                        .GetBytes(Configuration["JWTSettings:TokenKey"]))
                };
            });
            services.AddAuthorization();
            services.AddScoped<TokenService>();
            services.AddScoped<PaymentService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionMiddleware>();

            if (env.IsDevelopment())
            {
                // app.UseDeveloperExceptionPage(); // we want as much as information as possible to fix if anything wrong
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
            }

            // app.UseHttpsRedirection();

            app.UseRouting(); //middleware for routing, order is important here, but not in ConfigureServices

            app.UseDefaultFiles();
            app.UseStaticFiles();
            
            app.UseCors(opt =>
            {
                opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000", "http://localhost:3001");
            });
            app.UseAuthentication(); //middleware for authentication
            app.UseAuthorization(); //middleware for authorization

            app.UseEndpoints(endpoints => //middleware for mapping endpoint for the controller
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
