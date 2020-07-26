using System;

namespace BTrackerWeb.EF
{
    public class SmartHouseEntry
    {
        public int SmartHouseEntryId { get; set; }
        public int SmartHouseUserId { get; set; }
        public string SmartHouseEntryType { get; set; }
        public DateTime SmartHouseEntryDate {get; set;}

        public SmartHouseUser SmartHouseUser { get; set; }
    }
}