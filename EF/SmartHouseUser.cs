using System;

namespace BTrackerWeb.EF
{
    public class SmartHouseUser
    {
        public int SmartHouseUserId { get; set; }
        public string SmartHouseUserName { get; set; }
        public string SmartHouseUserEmail { get; set; }
        public string SmartHouseUserCode { get; set; }
        public DateTime SmartHouseUserArrival {get; set;}
        public DateTime SmartHouseUserLeave {get; set;}
    }
}