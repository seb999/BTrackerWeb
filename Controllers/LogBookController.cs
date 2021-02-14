using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BTrackerWeb.EF;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BTrackerWeb.Class;

namespace BTrackerWeb.Controllers
{
    [Route("api/[controller]")]
    public class LogBookController : Controller
    {
        private readonly ApplicationDbContext DbContext;

        public LogBookController([FromServices] ApplicationDbContext appDbContext)
        {
            DbContext = appDbContext;
        }

        [HttpGet]
        [Authorize]
        [Route("[Action]")]
        public List<LogBook> GetLogBookList()
        {
            string userId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            return DbContext.LogBook.Where(p => p.UserId == userId).ToList();
        }

        [HttpPost]
        [Authorize]
        [Route("[Action]")]
        public List<LogBook> SaveLog([FromBody] LogBook log)
        {
            log.UserId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            DbContext.LogBook.Add(log);
            DbContext.SaveChanges();
            return GetLogBookList();
        }

    }
}