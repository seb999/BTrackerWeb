using System;

namespace BTrackerWeb.EF
{
    public class SmartHouse
    {
        public int SmartHouseId { get; set; }
        public string SmartHouseName { get; set; }
        public string SmartHouseDescription { get; set; }
        public Boolean? SmartHouseIsActivate {get; set;}
    }
}