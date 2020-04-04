using System;
using System.Collections.Generic;

namespace BTrackerWeb.EF
{
    public class Device
    {
        public Device()
        {
            GpsPosition = new HashSet<GpsPosition>();
        }
    
        public int DeviceId { get; set; }
        public string UserId { get; set; }
        public string DeviceEUI { get; set; }
        public string DeviceDescription { get; set; }
        public bool? DeviceIsDeleted { get; set; }
        public DateTime DateAdded { get; set; }
        public string TTNDevID { get; set; }
        public bool? DeviceIsAlarmOn { get; set; }
        public string DeviceTel { get; set; }

        public ICollection<GpsPosition> GpsPosition { get; set; }
    }
}