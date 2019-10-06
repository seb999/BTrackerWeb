using System;
using System.Collections.Generic;

namespace BTrackerWeb.Class
{
    internal class PayLoadMetadata
    {
        //The device that will be use to identify the
        public DateTime Time { get; set; }

        public List<PayLoadGateway> Gateways{ get; set; }

    }
}