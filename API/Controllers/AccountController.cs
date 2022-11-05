using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;
        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context)
        {
            _context = context;
            _tokenService = tokenService;
            _userManager = userManager; //make use of the user manager to allow us to log in and register users into our app
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        { //async method ini return typenya User
            var user = await _userManager.FindByNameAsync(loginDto.UserName); //return typenya User
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized();

            var userBasket = await RetrieveBasket (loginDto.UserName);
            var anonBasket = await RetrieveBasket (Request.Cookies["buyerId"]); //if we are logging in we need to transfer this to our user

            if (anonBasket!=null){ //jika anonBasket tidak kosong maka jadikan sbg userBasket
                if (userBasket!=null) _context.Baskets.Remove(userBasket); //userBasket dihapus
                anonBasket.BuyerId= user.UserName;
                Response.Cookies.Delete("buyerId");
                await _context.SaveChangesAsync();
            }
            
            var basketDto = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket.MapBasketToDto();

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = basketDto
            };
        }
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        { //async method ini return typenya void (ga perlu return apapun)
            var user = new User { UserName = registerDto.UserName, Email = registerDto.Email };
            var result = await _userManager.CreateAsync(user, registerDto.Password); //username harus unik & password harus strong

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user, "Member");

            return StatusCode(201);
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var userBasket = await RetrieveBasket (User.Identity.Name); //supaya ada basket kalau masih ada token user

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = userBasket.MapBasketToDto()
            };
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
    }
}