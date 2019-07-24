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
    public class LocController : Controller
    {
        private readonly ApplicationDbContext DbContext; 

        public LocController([FromServices] ApplicationDbContext appDbContext)
        {
            DbContext = appDbContext;
        }

        // GET: Localisation
        public ActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                return View();
            }
            return RedirectToAction("Login", "Account");
        }

        #region method for Application

         ///Retrun number of position specify by Count parameter
        [HttpGet]
        [Authorize]
        [Route("/api/[controller]/GetGpsData/{deviceId}/{count}")]
        public List<GpsPosition> GetGpsData(int deviceId, int count)
        {
            string userId = DbContext.Users.Where(p=>p.Email == User.Claims.Last().Value).Select(p=>p.Id).FirstOrDefault();
            if(userId == null) return new List<GpsPosition>();
            return DbContext.GpsPosition.Where(p => p.DeviceId == deviceId).OrderByDescending(p=>p.GpsPositionDate).Take(count).ToList();
        }

        [HttpPost]
        [Route("/api/[controller]/GetHistoryData")]
        public List<GpsPosition> GetHistoryData([FromBody]HistoryRequest historyRequest)
        {
            if (User.Identity.IsAuthenticated && historyRequest.DeviceId.HasValue && historyRequest.Start.HasValue && historyRequest.End.HasValue)
            {
                return DbContext.GpsPosition.Where(p => p.DeviceId == historyRequest.DeviceId && p.GpsPositionDate >= historyRequest.Start && p.GpsPositionDate <= historyRequest.End).OrderBy(p => p.GpsPositionDate).ToList();
               // return DbContext.GpsPosition.Where(p => p.TrackedObject.TrackedObjectId == historyRequest.trackedObjectId && p.TrackedObject.UserId == User.Claims.FirstOrDefault().Value && p.GpsPositionDate >= historyRequest.start && p.GpsPositionDate <= historyRequest.end).OrderBy(p => p.GpsPositionDate).ToList();
            }
            return null;
        }

        
        ///Called by The Internet network
        ///Transfer position of device to db
        /// usage example : host/api/Loc/SaveData (use postman to simulate)
        [HttpPost]
        [Route("/api/[controller]/SaveData")]
        public string SaveData([FromBody]JObject rawPayLoad){
            RawPayLoad loraData = JsonConvert.DeserializeObject<RawPayLoad>(rawPayLoad.ToString());

            //TheThingNetwork send the EUI in the pay_load data
            //EUI is the link between Lora chip and User
            GpsPosition GpsData = new GpsPosition()
            {
                DeviceId = DbContext.Device.Where(p => p.DeviceEUI == loraData.Hardware_serial).Select(p => p.DeviceId).FirstOrDefault(),
                GpsPositionLatitude = DegreeToDecimal(loraData.Payload_fields.Latitude,loraData.Payload_fields.LatitudeDecimal),
                GpsPositionLongitude = DegreeToDecimal(loraData.Payload_fields.Longitude,loraData.Payload_fields.LongitudeDecimal),
                GpsPositionDate = loraData.Metadata.Time,

                //For debugging
                GpsPositionLatitudeRaw = string.Format("{0}.{1}",loraData.Payload_fields.Latitude,loraData.Payload_fields.LatitudeDecimal),
                GpsPositionLongitudeRaw = string.Format("{0}.{1}",loraData.Payload_fields.Longitude,loraData.Payload_fields.LongitudeDecimal)
            };
            DbContext.Add(GpsData);
            DbContext.SaveChanges();
            return "Saved";
        }

        public decimal DegreeToDecimal(int degreeMinute, int decimalMinute)
        {
            //Calculation ex: 5919.12925 -> 59 + 19/60  + 12.925/3600
            //DD = d + (min/60) + (sec/3600)
            int degree = degreeMinute/100;
            decimal minute = (decimal)(degreeMinute % 100)/60;
            decimal second = 0;
            if(decimalMinute>=10000) second = (decimal)(decimalMinute)/1000/3600;
            if(decimalMinute<10000) second = (decimal)(decimalMinute)/100/3600;
            return degree + minute + second;
        }
      
      #endregion
    
        #region methods for APP android or Ios

        ///Check if sensor is moving for APP
        /// usage example : host/api/Loc/IsSensorMoving/deviceEUI/2016-12-01T00:00:00
        [HttpGet]
        [Route("/api/[controller]/GetMotion/{deviceEUI}/{fromThisDate}")]
        public bool GetMotion(string deviceEUI, DateTime fromThisDate)
        {
            Boolean result;
            if(DbContext.Device.Where(p=>p.DeviceEUI == deviceEUI).FirstOrDefault()==null)
                return false;
            
            if (DbContext.GpsPosition.Where(p=>p.Device.DeviceEUI == deviceEUI && DateTime.Compare(p.GpsPositionDate, fromThisDate) >0).Count() >0)
            result =  true;
            else
            result = false;

            return result;
        }

          ///Retrun number of position specify by Count parameter
        [HttpGet]
        [Route("/api/[controller]/AppGetGpsData/{deviceEUI}/{count}")]
        public List<GpsPosition> AppGetGpsData(string deviceEUI, int count)
        {
            return DbContext.GpsPosition.Where(p => p.Device.DeviceEUI == deviceEUI).OrderByDescending(p=>p.GpsPositionDate).Take(count).ToList().OrderBy(p => p.GpsPositionDate).ToList();
        }

        #endregion
    }
}