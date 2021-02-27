using System;
using System.Collections.Generic;
using System.Linq;
using BTrackerWeb.EF;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BTrackerWeb.Class;

namespace BTrackerWeb.Controllers
{
    [Route("api/[controller]")]
    public class LookupController : Controller
    {
        private readonly ApplicationDbContext DbContext;

        public LookupController([FromServices] ApplicationDbContext appDbContext)
        {
            DbContext = appDbContext;
        }


        [HttpGet]
        [Route("[Action]")]
        public List<List<LookupItem>> GetLookupList()
        {
            List<List<LookupItem>> result = new List<List<LookupItem>>();
            result.Add(GetAircraftModelList());
            result.Add(GetAirportList());
            return result;
        }

        public List<LookupItem> GetAircraftModelList()
        {
            return DbContext.pl_aircraftModel.Select(p=>GetAircraftLookup(p)).ToList();
        }

        public List<LookupItem> GetAirportList()
        {
            return DbContext.pl_airport.Select(p=>GetAirportLookup(p)).ToList();
        }

        private static LookupItem GetAircraftLookup(AircraftModel aircraft)
        {
            LookupItem myItem = new LookupItem();
            myItem.Value = aircraft.AircraftModelId;
            myItem.Label = aircraft.AircraftModelName;

            return myItem;
        }

        private static LookupItem GetAirportLookup(Airport airport)
        {
            LookupItem myItem = new LookupItem();
            myItem.Value = airport.AirportId;
            myItem.Label = string.Format("{0} | {1}", airport.AirportName, airport.AirportCode);
            return myItem;
        }
    }
}