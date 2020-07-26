using System;
using System.Collections.Generic;

namespace BTrackerWeb.EF
{
    public class SmartHouseUser
    {
        public SmartHouseUser()
        {
            SmartHouseEntry = new HashSet<SmartHouseEntry>();
        }
        public int SmartHouseUserId { get; set; }
        public string SmartHouseUserName { get; set; }
        public string SmartHouseUserEmail { get; set; }
        public string SmartHouseUserCode { get; set; }
        public DateTime SmartHouseUserArrival {get; set;}
        public DateTime SmartHouseUserLeave {get; set;}
        public bool? SmartHouseUserIsDesactivated {get; set;}

        public ICollection<SmartHouseEntry> SmartHouseEntry { get; set; }
    }
}