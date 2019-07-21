using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BTrackerWeb.EF;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BTrackerWeb.Controllers
{
    public class MyDeviceController : Controller
    {
        private readonly ApplicationDbContext DbContext;

        public MyDeviceController([FromServices] ApplicationDbContext appDbContext)
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

        #region Portal method

        ///Return list of device for current userId
        [HttpGet]
        [Authorize]
        [Route("/api/[controller]/GetDeviceList")]
        public List<Device> GetDeviceList()
        {
            var ttt = DbContext.Device.Select(p=>p).OrderByDescending(p => p.DeviceId).ToList();;

             return DbContext.Device.Select(p=>p).OrderByDescending(p => p.DeviceId).ToList();

            // return DbContext.Device
            //         .Where(p => p.UserId == User.Claims.FirstOrDefault().Value)
            //         .Where(p=>p.DeviceIsDeleted.GetValueOrDefault() != true)
            //         .OrderByDescending(p => p.DeviceId).ToList();
        }

        #endregion

        #region APP methods

        ///Get list of device for APP
        [HttpGet]
        [Route("/api/[controller]/AppGetDeviceList/{userId}")]
        public List<Device> AppGetDeviceList(string userId)
        {
            var result =  DbContext.Device
                    .Where(p => p.UserId == userId)
                    .Where(p=>p.DeviceIsDeleted.GetValueOrDefault() != true)
                    .OrderBy(p => p.DateAdded).ToList();

            return result;
        }

        ///Save a new device
        [HttpPost]
        [Route("/api/[controller]/SaveDevice")]
        public List<Device> SaveDevice([FromBody] Device device)
        {
            device.UserId = User.Claims.FirstOrDefault().Value;
            DbContext.Add(device);
            DbContext.SaveChanges();
            return GetDeviceList();
        }

         ///Save a new device
        [HttpGet]
        [Authorize]
        [Route("/api/[controller]/DeleteDevice/{deviceId}")]
        public List<Device> DeleteDevice(int deviceId)
        {
            //Remove all entry from GpsPosition table
            DbContext.GpsPosition.RemoveRange(DbContext.GpsPosition.Where(predicate=>predicate.DeviceId == deviceId).Select(p=>p).ToList());
            //Remove device from Device table
            DbContext.Device.Remove(DbContext.Device.Where(predicate=>predicate.DeviceId == deviceId).FirstOrDefault());
            DbContext.SaveChanges();
            return GetDeviceList();
        }

        #endregion
    }
}