using System.Collections.Generic;
using System.Linq;
using BTrackerWeb.EF;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System;
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
        public FlyTime GetTotalFlyTime()
        {
             string userId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            FlyTime myFlyTime = new FlyTime();
           
            myFlyTime.TotalFlyTime = DbContext.pl_logBook
                .Where(p => p.UserId == userId).Sum(p=>p.LogBookTotalFlightTime);
           
            myFlyTime.TotalSolo = DbContext.pl_logBook
                .Where(p => p.UserId == userId && p.LogBookDual!=true).Sum(p=>p.LogBookTotalFlightTime);

            myFlyTime.TotalLanding = DbContext.pl_logBook
                .Where(p => p.UserId == userId).Sum(p=>p.LogBookLanding);
           
          return myFlyTime;
        }

        [HttpGet]
        [Authorize]
        [Route("[Action]/{year}")]
        public List<LogBook> GetLogBookList(int year)
        {
            string userId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            return DbContext.pl_logBook
                .Include(p => p.AircraftModel)
                .Include(p => p.AirportDeparture)
                .Include(p => p.AirportArrival)
                .Where(p => p.UserId == userId
                    && p.LogBookDate.Value.Year == year).OrderByDescending(p => p.LogBookId).ToList();
        }

        [HttpGet]
        [Route("[Action]/{userEmail}/{year}")]
        public List<LogBook> GetLogBookList(string userEmail, int year)
        {
            string userId = DbContext.Users.Where(p => p.Email == userEmail).Select(p => p.Id).FirstOrDefault();
            
            return DbContext.pl_logBook
                .Include(p => p.AircraftModel)
                .Include(p => p.AirportDeparture)
                .Include(p => p.AirportArrival)
                .Where(p => p.UserId == userId 
                    && p.LogBookDate.Value.Year == year).OrderByDescending(p => p.LogBookId).ToList();
        }

        [HttpPost]
        [Authorize]
        [Route("[Action]")]
        public List<LogBook> SaveLog([FromBody] LogBook log)
        {
            log.UserId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            DbContext.pl_logBook.Add(log);
            DbContext.SaveChanges();
            return GetLogBookList(DateTime.Now.Year);
        }

        [HttpPost]
        [Route("[Action]")]
        public void SaveLogFromApp([FromBody] LogBook log)
        {
            string userId = DbContext.Users.Where(p => p.Email == log.UserEmail).Select(p => p.Id).FirstOrDefault();
            log.UserId = userId;
            log.AirportDepartureId = 120;
            log.AirportArrivalId = 120;
            log.AircraftModelId = 1;
            //log.LogBookTotalFlightTime = 1;
            log.LogBookPIC = true;
            DbContext.pl_logBook.Add(log);
            DbContext.SaveChanges();
        }



        [HttpGet]
        [Authorize]
        [Route("[Action]/{logId}")]
        public List<LogBook> DeleteLog(int logId)
        {
            LogBook logItem = DbContext.pl_logBook.Where(p => p.LogBookId == logId).Select(p => p).FirstOrDefault();
            DbContext.pl_logBook.Remove(logItem);
            DbContext.SaveChanges();
            return GetLogBookList(DateTime.Now.Year);
        }

        [HttpPost]
        [Route("[Action]")]
        public void UpdateLogFromApp([FromBody] LogBook log)
        {
            string userId = DbContext.Users.Where(p => p.Email == log.UserEmail).Select(p => p.Id).FirstOrDefault();
            log.UserId = userId;
            var myLog = DbContext.pl_logBook.Where(p=>p.LogBookId == log.LogBookId).FirstOrDefault();
            myLog.LogBookLanding = log.LogBookLanding;
            myLog.AircraftModelId = log.AircraftModel.AircraftModelId;
            myLog.LogBookAircraftRegistration = log.LogBookAircraftRegistration;
            myLog.LogBookTotalFlightTime = log.LogBookTotalFlightTime;
            myLog.LogBookArrivalTime = log.LogBookArrivalTime;
            myLog.LogBookDepartureTime = log.LogBookDepartureTime;
            myLog.AirportDepartureId = log.AirportDeparture.AirportId;
            myLog.AirportArrivalId = log.AirportArrival.AirportId;

            myLog.LogBookPIC = log.LogBookPIC;
            myLog.LogBookDual = log.LogBookDual;
            myLog.LogBookCoPilot = log.LogBookCoPilot;
            myLog.LogBookIFR = log.LogBookIFR;
            myLog.LogBookNight = log.LogBookNight;
            myLog.LogBookTotalFlightTime = log.LogBookTotalFlightTime;
            DbContext.pl_logBook.Update(myLog);
            DbContext.SaveChanges();
        }

        [HttpPost]
        [Authorize]
        [Route("/api/[controller]/[Action]")]
        public List<LogBook> UpdateLog([FromBody] LogBook log)
        {
            log.UserId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            DbContext.pl_logBook.Update(log);
            DbContext.SaveChanges();
            return GetLogBookList(DateTime.Now.Year);
        }
    }
}