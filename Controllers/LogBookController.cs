using System.Collections.Generic;
using System.Linq;
using BTrackerWeb.EF;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

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
            return DbContext.pl_logBook
                .Include(p => p.AircraftModel)
                .Include(p => p.AirportDeparture)
                .Include(p => p.AirportArrival)
                .Where(p => p.UserId == userId).OrderByDescending(p => p.LogBookDate).ToList();
        }

        [HttpPost]
        [Authorize]
        [Route("[Action]")]
        public List<LogBook> SaveLog([FromBody] LogBook log)
        {
            log.UserId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            DbContext.pl_logBook.Add(log);
            DbContext.SaveChanges();
            return GetLogBookList();
        }

        [HttpGet]
        [Authorize]
        [Route("[Action]/{logId}")]
        public List<LogBook> DeleteLog(int logId)
        {
            LogBook logItem = DbContext.pl_logBook.Where(p => p.LogBookId == logId).Select(p => p).FirstOrDefault();
            DbContext.pl_logBook.Remove(logItem);
            DbContext.SaveChanges();
            return GetLogBookList();
        }

        [HttpPost]
        [Authorize]
        [Route("/api/[controller]/[Action]")]
        public List<LogBook> UpdateLog([FromBody] LogBook log)
        {
            log.UserId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            DbContext.pl_logBook.Update(log);
            DbContext.SaveChanges();
            return GetLogBookList();
        }
    }
}