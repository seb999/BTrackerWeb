using System;
using System.Collections.Generic;

namespace BTrackerWeb.EF
{
    public class RequestTrans
    {
        public int RequestTransId { get; set; }
        public string UserId { get; set; }
        public string RequestTransSymbol { get; set; }
       public string RequestTransAmount { get; set; }
    }
}