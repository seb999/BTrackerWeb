using System;
using System.Collections.Generic;

namespace BTrackerWeb.EF
{
    public class AircraftModel
    {
        public AircraftModel()
        {
            LogBook = new HashSet<LogBook>();
        }

        public int AircraftModelId { get; set; }
        public string AircraftModelName { get; set; }

        public ICollection<LogBook> LogBook { get; set; }
    }
}