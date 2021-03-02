using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace BTrackerWeb.EF
{
    public class WayPoint
    {
        public int WayPointId { get; set; }
        public int FlightPlanId { get; set; }
        public decimal WayPointLon { get; set; }
         public decimal WayPointLat { get; set; }
        public string WayPointName { get; set; }
        public string WayPointDescription { get; set; }

        public virtual FlightPlan FlightPlan { get; set; }
    }
}