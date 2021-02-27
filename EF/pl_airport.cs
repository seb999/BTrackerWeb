using System;
using System.Collections.Generic;

namespace BTrackerWeb.EF
{
    public class Airport
    {
        public int AirportId { get; set; }
        public string AirportCode { get; set; }
        public string AirportName { get; set; }

        // public virtual ICollection<LogBook> LogBook { get; set; }
    }
}