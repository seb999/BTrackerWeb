using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BTrackerWeb.Class;
using BTrackerWeb.EF;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace BTrackerWeb.Controllers
{
    public class GpsController : Controller
    {
        private readonly ApplicationDbContext DbContext;

        public GpsController([FromServices] ApplicationDbContext appDbContext)
        {
            DbContext = appDbContext;
        }

        #region method for Application / APP

        ///Retrun number of position specify by Count parameter
        [HttpGet]
        [Authorize]
        [Route("/api/[controller]/GetGpsData/{trackerId}/{count}")]
        public List<GpsPosition> GetGpsData(int trackerId, int count)
        {
            string userId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            if (userId == null) return new List<GpsPosition>();
            if(count==0) count = 100;

            if (trackerId == 0)
            {
                return DbContext.GpsPosition
                    .Include(p => p.Device)
                    .Where(p => p.Device.UserId == userId).OrderByDescending(p => p.GpsPositionDate).Take(count).ToList();
            }
            else
            {
                return DbContext.GpsPosition
                    .Include(p => p.Device)
                    .Where(p => p.DeviceId == trackerId).OrderByDescending(p => p.GpsPositionDate).Take(count).ToList();
            }
        }

        ///Called by The Internet network
        ///Transfer position of device to db
        /// usage example : host/api/Gps/SaveData (use postman to simulate)
        [HttpPost]
        [Route("/api/[controller]/SaveData")]
        public string SaveData([FromBody]JObject rawPayLoad)
        {
            PayLoad loraData = JsonConvert.DeserializeObject<PayLoad>(rawPayLoad.ToString());

            //TheThingNetwork send the EUI in the pay_load data
            //EUI is the link between Lora chip and User
            GpsPosition gpsData = new GpsPosition();

            gpsData.DeviceId = DbContext.Device.Where(p => p.DeviceEUI == loraData.Hardware_serial).Select(p => p.DeviceId).FirstOrDefault();
            //GpsPositionDate = loraData.Metadata.Time, //the lora shield give GMT time not GMT+2
            gpsData.GpsPositionDate = DateTime.Now;
            

            if (loraData.Payload_fields.Latitude != 0 && loraData.Payload_fields.Longitude != 0)
            {
                gpsData.GpsPositionIsGateway = false;
                gpsData.GpsPositionLatitude = DegreeToDecimal(loraData.Payload_fields.Latitude, loraData.Payload_fields.LatitudeDecimal);
                gpsData.GpsPositionLongitude = DegreeToDecimal(loraData.Payload_fields.Longitude, loraData.Payload_fields.LongitudeDecimal);
                gpsData.GpsPositionLatitudeRaw = string.Format("{0}.{1}", loraData.Payload_fields.Latitude, loraData.Payload_fields.LatitudeDecimal);
                gpsData.GpsPositionLongitudeRaw = string.Format("{0}.{1}", loraData.Payload_fields.Longitude, loraData.Payload_fields.LongitudeDecimal);
            }
            else
            {
                gpsData.GpsPositionIsGateway = true;
                gpsData.GpsPositionLatitude = loraData.Metadata.Gateways != null ? loraData.Metadata.Gateways.FirstOrDefault().Latitude : 0;
                gpsData.GpsPositionLongitude = loraData.Metadata.Gateways != null ?loraData.Metadata.Gateways.FirstOrDefault().Longitude : 0;
            }
            DbContext.Add(gpsData);
            DbContext.SaveChanges();
            return "Saved";
        }

        [HttpGet]
        [Authorize]
        [Route("/api/[controller]/deleteData/{id}")]
        public void DeleteData(int id)
        {
            GpsPosition gpsItem = DbContext.GpsPosition.Where(p => p.GpsPositionId == id).Select(p => p).FirstOrDefault();
            DbContext.Remove(gpsItem);
            DbContext.SaveChanges();
        }

        #endregion

        #region Helper

        private decimal DegreeToDecimal(int degreeMinute, int decimalMinute)
        {
            //Calculation ex: 5919.12925 -> 59 + 19/60  + 12.925/3600
            //DD = d + (min/60) + (sec/3600)
            int degree = degreeMinute / 100;
            decimal minute = (decimal)(degreeMinute % 100) / 60;
            decimal second = 0;
            if (decimalMinute >= 10000) second = (decimal)(decimalMinute) / 1000 / 3600;
            if (decimalMinute < 10000) second = (decimal)(decimalMinute) / 100 / 3600;
            return degree + minute + second;
        }

        #endregion
    }
}