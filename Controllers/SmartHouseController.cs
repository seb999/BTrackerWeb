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

        [HttpGet]
        [Authorize]
        [Route("/api/[controller]/[Action]")]
        public List<SmartHouseUser> GetUserList()
        {
            return DbContext.SmartHouseUser.Select(p=>p).ToList();
        }

        #region Door/Switch

        [HttpPost]
        [Route("/api/[controller]/[Action]")]
        public List<SmartHouse> UpdateSwitch([FromBody] SmartHouse smartHouse)
        {
            SmartHouse mySwitch = DbContext.SmartHouse.Where(p => p.SmartHouseId == smartHouse.SmartHouseId).Select(p => p).FirstOrDefault();
            mySwitch.SmartHouseIsClosed = smartHouse.SmartHouseIsClosed;
            DbContext.SaveChanges();
            return GetSwitchList();
        }

        [HttpPost]
        [Route("/api/[controller]/[Action]")]
        public SmartHouse OpenDoor([FromBody] SmartHouseUser user)
        {
            var userFound = DbContext.SmartHouseUser.Where(p => p.SmartHouseUserCode == user.SmartHouseUserCode && p.SmartHouseUserIsDesactivated != true).Select(p => p).FirstOrDefault();

            if (userFound != null)
            {
                if (DateTime.Now >= userFound.SmartHouseUserArrival &&  DateTime.Now <= userFound.SmartHouseUserLeave){
                    SmartHouse mySwitch = DbContext.SmartHouse.Where(p => p.SmartHouseType == 2).Select(p => p).FirstOrDefault();
                    mySwitch.SmartHouseIsClosed = false;

                    DbContext.SmartHouseEntry.Add(new SmartHouseEntry(){SmartHouseEntryDate = DateTime.Now, SmartHouseUserId = userFound.SmartHouseUserId, SmartHouseEntryType = "Open"});
                    
                    DbContext.SaveChanges();
                }
            }

            return GetDoorSwitch();
        }

        #endregion

        #region User

        [HttpPost]
        [Authorize]
        [Route("/api/[controller]/[Action]")]
        public List<SmartHouseUser> SaveUser([FromBody] SmartHouseUser user)
        {
            DbContext.Add(user);
            DbContext.SaveChanges();
            return GetUserList();
        }

        [HttpPost]
        [Authorize]
        [Route("/api/[controller]/[Action]")]
        public List<SmartHouseUser> UpdateUser([FromBody] SmartHouseUser user)
        {
            SmartHouseUser myUser = DbContext.SmartHouseUser.Where(p => p.SmartHouseUserId == user.SmartHouseUserId).Select(p => p).FirstOrDefault();
            myUser.SmartHouseUserArrival = user.SmartHouseUserArrival;
            myUser.SmartHouseUserCode = user.SmartHouseUserCode;
            myUser.SmartHouseUserEmail = user.SmartHouseUserEmail;
            myUser.SmartHouseUserLeave = user.SmartHouseUserLeave;
            myUser.SmartHouseUserName = user.SmartHouseUserName;
            myUser.SmartHouseUserPhone = user.SmartHouseUserPhone;
            myUser.SmartHouseUserAmount = user.SmartHouseUserAmount;
            myUser.SmartHouseUserIsDesactivated = user.SmartHouseUserIsDesactivated;
              // DbContext.Update(user);   try this
              
            DbContext.SaveChanges();
         
            return GetUserList();
        }

        [HttpPost]
        [Authorize]
        [Route("/api/[controller]/[Action]")]
        public Boolean CheckCode([FromBody] SmartHouseUser user)
        {
            SmartHouseUser userFound = DbContext.SmartHouseUser.Where(p => p.SmartHouseUserCode == user.SmartHouseUserCode).Select(p => p).FirstOrDefault();
            if (userFound != null)
            {
                return false;
            }
            return true;
        }

        #endregion
    }
}