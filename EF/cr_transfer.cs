using System;
using System.Collections.Generic;

namespace BTrackerWeb.EF
{
    public class Transfer
    {
        public int TransferId { get; set; }
        public int TerminalId { get; set; }
        public decimal TransferAmountRequested { get; set; }
        public string TransferSymbol { get; set; }
        public decimal TransferAmount { get; set; }
        public bool? TransferIsCompleted { get; set; }

        public Terminal Terminal { get; set; }
    }
}