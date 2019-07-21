using System;

namespace BTrackerWeb.EF
{
    public class GpsPosition
    {
        public int GpsPositionId { get; set; }
        public int DeviceId { get; set; }
        public decimal GpsPositionLatitude { get; set; }
        public decimal GpsPositionLongitude { get; set; }
        public decimal GpsPositionSpeed { get; set; }
        public decimal GpsPositionHeading { get; set; }
        public DateTime GpsPositionDate { get; set; }

        public string GpsPositionLatitudeRaw { get; set; }
        public string GpsPositionLongitudeRaw { get; set; }

        public Device Device { get; set; }
    }
}