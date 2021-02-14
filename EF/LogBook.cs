using System;

namespace BTrackerWeb.EF
{
    public class LogBook
    {
        public int LogBookId { get; set; }
        public string UserId { get; set; }
        public DateTime? LogBookDate { get; set; }
         public string LogBookAircraftRegistration { get; set; }
        public string LogBookAircraftModel { get; set; }
        public string LogBookDeparturePlace { get; set; }
        public DateTime? LogBookDepartureTime {get; set;}
        public string LogBookArrivalPlace { get; set; }
        public DateTime? LogBookArrivalTime { get; set; }
        public Decimal LogBookTotalFlightTime { get; set; }
        public Boolean? LogBookIFR { get; set; }
        public Boolean? LogBookNight { get; set; }
        public string LogBookPIC { get; set; }
        public string LogBookCoPilot { get; set; }
        public Boolean? LogBookDual { get; set; }
    }
}