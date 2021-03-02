using System.Collections.Generic;
using System.Linq;
using BTrackerWeb.EF;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace BTrackerWeb.Controllers
{
    [Route("api/[controller]")]
    public class FlightPlanController : Controller
    {
        private readonly ApplicationDbContext DbContext;

        public FlightPlanController([FromServices] ApplicationDbContext appDbContext)
        {
            DbContext = appDbContext;
        }

        [HttpGet]
        [Authorize]
        [Route("[Action]")]
        public List<FlightPlan> GetFlightPlanList()
        {
            string userId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            return DbContext.pl_flightPlan
                .Where(p => p.UserId == userId).OrderByDescending(p => p.FlightPlanDate).ToList();
        }

        [HttpPost]
        [Authorize]
        [Route("[Action]")]
        public List<FlightPlan> AddFlightPlan([FromBody] FlightPlan FL)
        {
            FL.UserId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            DbContext.pl_flightPlan.Add(FL);
            DbContext.SaveChanges();
            return GetFlightPlanList();
        }

        [HttpGet]
        [Authorize]
        [Route("[Action]/{flightPlanId}")]
        public List<FlightPlan> DeleteLog(int flightPlanId)
        {
            FlightPlan FL = DbContext.pl_flightPlan.Where(p => p.FlightPlanId == flightPlanId).Select(p => p).FirstOrDefault();
            DbContext.pl_flightPlan.Remove(FL);
            DbContext.SaveChanges();
            return GetFlightPlanList();
        }

        [HttpPost]
        [Authorize]
        [Route("/api/[controller]/[Action]")]
        public List<FlightPlan> UpdateLog([FromBody] FlightPlan FL)
        {
            FL.UserId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            DbContext.pl_flightPlan.Update(FL);
            DbContext.SaveChanges();
            return GetFlightPlanList();
        }
    }
}