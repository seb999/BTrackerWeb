using System;
using System.Collections.Generic;

namespace BTrackerWeb.EF
{
    public class CryptoArduinoTransfer
    {
        public int TransferId { get; set; }
        public int TerminalId { get; set; }
        public string TransferAmountRequested { get; set; }
        public string TransferSymbol { get; set; }
        public string TransferAmount { get; set; }
        public bool? TransferIsCompleted { get; set; }
    }
}