using System;

namespace BTrackerWeb.EF
{
    public class HistoryRequest
    {
         public DateTime? Start { get; set; }
        public DateTime? End { get; set; }

        public int? DeviceId { get; set; }

        //public int? trackedObjectId { get; set; }
    }
}