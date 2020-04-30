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
    public class SmartHouseController : Controller
    {
        private readonly ApplicationDbContext DbContext;

        public SmartHouseController([FromServices] ApplicationDbContext appDbContext)
        {
            DbContext = appDbContext;
        }

        ///Return lookuplist of tracker for current userId
        [HttpGet]
        [Route("/api/[controller]/[Action]")]
        public List<SmartHouse> GetSwitchList()
        {
            return DbContext.SmartHouse.ToList();
        }

        [HttpPost]
        [Route("/api/[controller]/[Action]")]
        public List<SmartHouse> UpdateSwitch([FromBody] SmartHouse smartHouse)
        {
            SmartHouse mySwitch = DbContext.SmartHouse.Where(p => p.SmartHouseId == smartHouse.SmartHouseId).Select(p => p).FirstOrDefault();
            mySwitch.SmartHouseIsActivate = smartHouse.SmartHouseIsActivate;
            DbContext.SaveChanges();
            return GetSwitchList();
        }
    }
}