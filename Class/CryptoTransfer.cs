using System.Collections.Generic;

namespace BTrackerWeb.Class
{
    public class CryptoTransferParent
    {
        public int Total { get; set; }
        public List<CryptoTransfer> Rows { get; set; }

    }

    public class CryptoTransfer{
        public string Asset { get; set; }
        public string Amount { get; set; }
        public string Type { get; set; }
        public string Status { get; set; }
        public long TransId { get; set; }
        public long Timestamp { get; set; }
    }
}