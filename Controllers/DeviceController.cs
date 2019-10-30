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
    public class DeviceController : Controller
    {
        private readonly ApplicationDbContext DbContext;

        public DeviceController([FromServices] ApplicationDbContext appDbContext)
        {
            DbContext = appDbContext;
        }
        public IActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                return View();
            }
            return RedirectToAction("Login", "Account");
        }

        ///Return lookuplist of device for current userId
        [HttpGet]
        [Authorize]
        [Route("/api/[controller]/[Action]")]
        public List<LookupItem> Get()
        {
            string userId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            if (userId == null) return null;

            return DbContext.Device
                .Where(p => p.UserId == userId)
                .Where(p=>p.DeviceIsDeleted !=true)
                .Select(p => new LookupItem{
                        Id = p.DeviceId,
                        Value = p.DeviceDescription
                }).OrderByDescending(p => p.Id).ToList();              
        }

        ///Return list of device for current userId
        [HttpGet]
        [Authorize]
        [Route("/api/[controller]/[Action]")]
        public List<Device> GetDeviceList()
        {
            string userId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            if (userId == null) return new List<Device>();
            return DbContext.Device
                .Where(p => p.UserId == userId)
                .Where(p=>p.DeviceIsDeleted !=true)
                .Select(p => p).OrderByDescending(p => p.DeviceId).ToList();
        }

        [HttpPost]
        [Authorize]
        [Route("/api/[controller]/[Action]")]
        public List<Device> SaveDevice([FromBody] Device device)
        {
            Device deviceDeleted = DbContext.Device.Where(p => p.DeviceEUI == device.DeviceEUI).FirstOrDefault();
            if(deviceDeleted!=null)
            {
                deviceDeleted.DeviceIsDeleted = false;
                DbContext.Update(deviceDeleted);
            }
            else
            {
                device.UserId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
                device.DateAdded = DateTime.Now;
                DbContext.Add(device);
            }

            DbContext.SaveChanges();
            return GetDeviceList();
        }

        [HttpPost]
        [Authorize]
        [Route("/api/[controller]/[Action]")]
        public List<Device> UpdateDevice([FromBody] Device device)
        {
            Device myDevice = DbContext.Device.Where(p=>p.DeviceId == device.DeviceId).Select(p => p).FirstOrDefault();
            myDevice.DeviceDescription = device.DeviceDescription;
            DbContext.SaveChanges();
            return GetDeviceList();
        }

        [HttpGet]
        [Authorize]
        [Route("/api/[controller]/[Action]/{deviceId}")]
        public List<Device> DeleteDevice(int deviceId)
        {
            //Remove all entry from GpsPosition table
            DbContext.GpsPosition.RemoveRange(DbContext.GpsPosition.Where(predicate => predicate.DeviceId == deviceId).Select(p => p).ToList());
            //We desactivate the device
            Device device = DbContext.Device.Where(predicate => predicate.DeviceId == deviceId).FirstOrDefault();
            device.DeviceIsDeleted = true;
            DbContext.Update(device);
            DbContext.SaveChanges();
            return GetDeviceList();
        }
    }
}