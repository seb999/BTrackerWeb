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
    public class TrackerController : Controller
    {
        private readonly ApplicationDbContext DbContext;

        public TrackerController([FromServices] ApplicationDbContext appDbContext)
        {
            DbContext = appDbContext;
        }
        // public IActionResult Index()
        // {
        //     if (User.Identity.IsAuthenticated)
        //     {
        //         return View();
        //     }
        //    // return RedirectToAction("Login", "Account");
        // }

        ///Return lookuplist of tracker for current userId
        [HttpGet]
        [Authorize]
        [Route("/api/[controller]/[Action]")]
        public List<LookupItem> Get()
        {
            string userId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            if (userId == null) return null;

            return DbContext.Device
                .Where(p => p.UserId == userId)
                .Where(p => p.DeviceIsDeleted != true)
                .Select(p => new LookupItem
                {
                    Value = p.DeviceId,
                    Label = p.DeviceDescription
                }).OrderByDescending(p => p.Value).ToList();
        }

        ///Return list of device for current userId
        [HttpGet]
        [Authorize]
        [Route("/api/[controller]/[Action]")]
        public List<Device> GetTrackerList()
        {
            string userId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            if (userId == null) return new List<Device>();
            return DbContext.Device
                .Where(p => p.UserId == userId)
                .Where(p => p.DeviceIsDeleted != true)
                .Select(p => p).OrderByDescending(p => p.DeviceId).ToList();
        }

        [HttpPost]
        [Authorize]
        [Route("/api/[controller]/[Action]")]
        public List<Device> SaveTracker([FromBody] Device device)
        {
            device.UserId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            device.DateAdded = DateTime.Now;
            DbContext.Add(device);
            DbContext.SaveChanges();
            return GetTrackerList();
        }

        [HttpPost]
        [Authorize]
        [Route("/api/[controller]/[Action]")]
        public List<Device> UpdateTracker([FromBody] Device device)
        {
            Device myDevice = DbContext.Device.Where(p => p.DeviceId == device.DeviceId).Select(p => p).FirstOrDefault();
            myDevice.DeviceDescription = device.DeviceDescription;
            myDevice.DeviceEUI = device.DeviceEUI;
            myDevice.DeviceIsAlarmOn = device.DeviceIsAlarmOn;
            myDevice.DeviceTel = device.DeviceTel;
            DbContext.SaveChanges();
            return GetTrackerList();
        }

        [HttpGet]
        [Authorize]
        [Route("/api/[controller]/[Action]/{deviceId}")]
        public List<Device> DeleteTracker(int deviceId)
        {
            //Remove all entry from GpsPosition table
            DbContext.GpsPosition.RemoveRange(DbContext.GpsPosition.Where(predicate => predicate.DeviceId == deviceId).Select(p => p).ToList());
            //We remove the device
            Device device = DbContext.Device.Where(predicate => predicate.DeviceId == deviceId).FirstOrDefault();
            DbContext.Remove(device);
            DbContext.SaveChanges();
            return GetTrackerList();   
            //sdsds
        }
    }
}