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

        [HttpGet]
        [Route("/api/[controller]/[Action]")]
        public List<SmartHouse> GetSwitchList()
        {
            return DbContext.SmartHouse.Where(p => p.SmartHouseType == 1).ToList();
        }

        [HttpGet]
        [Route("/api/[controller]/[Action]")]
        public SmartHouse GetDoorSwitch()
        {
            return DbContext.SmartHouse.Where(p => p.SmartHouseType == 2).FirstOrDefault();
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

        [HttpPost]
        [Route("/api/[controller]/[Action]")]
        public SmartHouse OpenDoor([FromBody] SmartHouseUser user)
        {
            var userFound = DbContext.SmartHouseUser.Where(p => p.SmartHouseUserCode == user.SmartHouseUserCode).Select(p => p).FirstOrDefault();

            if (userFound != null)
            {
                if (DateTime.Now >= userFound.SmartHouseUserArrival &&  DateTime.Now <= userFound.SmartHouseUserLeave){
                    SmartHouse mySwitch = DbContext.SmartHouse.Where(p => p.SmartHouseType == 2).Select(p => p).FirstOrDefault();
                    mySwitch.SmartHouseIsActivate = false;
                    DbContext.SaveChanges();
                }
            }

            return GetDoorSwitch();
        }
    }
}