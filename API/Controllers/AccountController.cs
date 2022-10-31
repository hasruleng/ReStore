using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController: BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        public AccountController(UserManager<User> userManager, TokenService tokenService){
            _tokenService = tokenService;
            _userManager = userManager; //make use of the user manager to allow us to log in and register users into our app
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto){ //async method ini return typenya User
            var user = await _userManager.FindByNameAsync(loginDto.UserName); //return typenya User
            if (user==null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized();

            return new UserDto{
                Email=user.Email,
                Token = await _tokenService.GenerateToken(user)
            };
        }
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto){ //async method ini return typenya void (ga perlu return apapun)
            var user = new User{UserName=registerDto.UserName, Email=registerDto.Email}; 
            var result = await _userManager.CreateAsync(user, registerDto.Password); //username harus unik & password harus strong

            if (!result.Succeeded)
            {
                foreach(var error in result.Errors){
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user, "Member");

            return StatusCode(201);
        }
        
        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser(){
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            return new UserDto{
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user)
            };
        }
    }
}