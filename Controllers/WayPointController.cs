using System.Collections.Generic;
using System.Linq;
using BTrackerWeb.EF;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace BTrackerWeb.Controllers
{
    [Route("api/[controller]")]
    public class WayPointController : Controller
    {
        private readonly ApplicationDbContext DbContext;

        public WayPointController([FromServices] ApplicationDbContext appDbContext)
        {
            DbContext = appDbContext;
        }

        [HttpGet]
        [Authorize]
        [Route("[Action]")]
        public List<WayPoint> GetWayPointList()
        {
            string userId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            return DbContext.pl_wayPoint
                .Where(p => p.FlightPlan.UserId == userId).OrderBy(p => p.WayPointId).ToList();
        }

        [HttpPost]
        [Authorize]
        [Route("[Action]")]
        public List<WayPoint> AddWayPoint([FromBody] WayPoint wayPoint)
        {
            int FPId  = DbContext.pl_flightPlan.Where(p => p.UserId == User.Claims.Last().Value).Select(p => p.FlightPlanId).FirstOrDefault();
            
            wayPoint.FlightPlanId = FPId;
            DbContext.Add(wayPoint);
            DbContext.SaveChanges();
            return GetWayPointList();
        }

        [HttpGet]
        [Authorize]
        [Route("[Action]/{flightPland}")]
        public List<WayPoint> DeleteWayPoint(int wayPointId)
        {
            WayPoint wayPoint = DbContext.pl_wayPoint.Where(p => p.WayPointId == wayPointId).Select(p => p).FirstOrDefault();
            DbContext.pl_wayPoint.Remove(wayPoint);
            DbContext.SaveChanges();
            return GetWayPointList();
        }

        [HttpPost]
        [Authorize]
        [Route("/api/[controller]/[Action]")]
        public List<WayPoint> UpdateWayPoint([FromBody] WayPoint wayPoint)
        {
            int FPId  = DbContext.pl_flightPlan.Where(p => p.UserId == User.Claims.Last().Value).Select(p => p.FlightPlanId).FirstOrDefault();
            
            wayPoint.FlightPlanId = FPId;
            DbContext.pl_wayPoint.Update(wayPoint);
            DbContext.SaveChanges();
            return GetWayPointList();
        }
    }
}