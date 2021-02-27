using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BTrackerWeb.EF
{
    public class LogBook
    {
        public int LogBookId { get; set; }
        public string UserId { get; set; }

        [ForeignKey("AirportDeparture")]
        public int AirportDepartureId { get; set; }

        [ForeignKey("AirportArrival")]
        public int AirportArrivalId { get; set; }

        public int AircraftModelId { get; set; }
        public DateTime? LogBookDate { get; set; }
         public string LogBookAircraftRegistration { get; set; }
        public string LogBookAircraftModel { get; set; }
        public string LogBookDeparturePlace { get; set; }
        public TimeSpan? LogBookDepartureTime {get; set;}
        public string LogBookArrivalPlace { get; set; }
        public TimeSpan? LogBookArrivalTime { get; set; }
        public Decimal LogBookTotalFlightTime { get; set; }
        public Boolean? LogBookIFR { get; set; }
        public Boolean? LogBookNight { get; set; }
        public string LogBookPIC { get; set; }
        public string LogBookCoPilot { get; set; }
        public Boolean? LogBookDual { get; set; }
        public string LogBookDescription { get; set; }

        public AircraftModel AircraftModel { get; set; }
        public virtual Airport AirportDeparture { get; set; }
        public virtual Airport AirportArrival { get; set; }
    }
}/*  */