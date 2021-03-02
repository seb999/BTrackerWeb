using System;
using System.Collections.Generic;

namespace BTrackerWeb.EF
{
    public class FlightPlan
    {
        public int FlightPlanId { get; set; }
        public string UserId { get; set; }
        public DateTime FlightPlanDate { get; set; }
       public string FlightPlanName { get; set; }
       public string FlightPlanDescription { get; set; }
    }
}