using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BTrackerWeb.Class;
using BTrackerWeb.EF;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Okta.AspNetCore;

namespace BTrackerWeb.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext DbContext; 

        public UserController([FromServices] ApplicationDbContext appDbContext)
        {
            DbContext = appDbContext;
        }

        [HttpGet]
        [Authorize]
        [Route("[action]")]
        public void CheckLocalUserId()
        {
            string userId = DbContext.Users.Where(p=>p.Email == User.Claims.Last().Value).Select(p=>p.Id).FirstOrDefault();
            if(userId != null) return;

            var newUser = new ApplicationUser(){
                Email =  User.Claims.Last().Value,
                UserName = User.Claims.Last().Value,
                LockoutEnabled = true,
                NormalizedEmail = User.Claims.Last().Value.ToUpper(),
                NormalizedUserName = User.Claims.Last().Value.ToUpper(),
            };
            DbContext.Add(newUser);
            DbContext.SaveChanges();
        }

        [HttpGet]
        [Route("[action]")]
        public string TestApi()
        {
            return "API running!";
        }
    }
}