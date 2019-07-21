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

         ///Retrun number of position specify by Count parameter
        [HttpGet]
        // [Authorize]
        [Route("[action]")]
        public int CheckLocalUserId()
        {
            if (User.Identity.IsAuthenticated)
            {
                return 3;
               // return DbContext.GpsPosition.Where(p => p.DeviceId == deviceId).OrderByDescending(p=>p.GpsPositionDate).Take(count).ToList();
                //return DbContext.GpsPosition.Where(p => p.TrackedObject.TrackedObjectId == trackedObjectId && p.TrackedObject.UserId == User.Claims.FirstOrDefault().Value).OrderByDescending(p=>p.GpsPositionDate).Take(count).ToList().OrderBy(p => p.GpsPositionDate).ToList();
            }

            return 0;
        }
    }
}