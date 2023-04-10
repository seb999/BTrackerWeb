using System;
using System.Collections.Generic;
using System.Linq;
using BTrackerWeb.EF;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BTrackerWeb.Class;
using Microsoft.EntityFrameworkCore;

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
            result.Add(GetCurrencyList());
            result.Add(GetSymbolList());

            return result;
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public List<LookupItem> GetAircraftModelList()
        {
            return DbContext.pl_aircraftModel.Select(p=>GetAircraftLookup(p)).ToList();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public List<LookupItem> GetAirportList()
        {
            return DbContext.pl_airport.Select(p=>GetAirportLookup(p)).ToList();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public List<LookupItem> GetCurrencyList()
        {
            return DbContext.cr_currency.Select(p=>GetCurrencyLookup(p)).ToList();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public List<LookupItem> GetSymbolList()
        {
            return DbContext.cr_symbol.Select(p=>GetSymbolLookup(p)).ToList();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        private static LookupItem GetAircraftLookup(AircraftModel aircraft)
        {
            LookupItem myItem = new LookupItem();
            myItem.Value = aircraft.AircraftModelId;
            myItem.Label = aircraft.AircraftModelName;

            return myItem;
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        private static LookupItem GetAirportLookup(Airport airport)
        {
            LookupItem myItem = new LookupItem();
            myItem.Value = airport.AirportId;
            myItem.Label = string.Format("{0} | {1}", airport.AirportName, airport.AirportCode);
            return myItem;
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        private static LookupItem GetCurrencyLookup(Currency currency)
        {
            LookupItem myItem = new LookupItem();
            myItem.Value = currency.CurrencyId;
            myItem.Label = currency.CurrencyName;
            return myItem;
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        private static LookupItem GetSymbolLookup(Symbol symbol)
        {
            LookupItem myItem = new LookupItem();
            myItem.Value = symbol.SymbolId;
            myItem.Label = symbol.SymbolName;

            return myItem;
        }
    }
}