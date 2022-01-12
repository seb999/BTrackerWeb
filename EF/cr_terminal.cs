using System;
using System.Collections.Generic;

namespace BTrackerWeb.EF
{
    public class Terminal
    {
        public int TerminalId { get; set; }
        public string UserId { get; set; }
        public string TerminalDescription { get; set; }
        public string TerminalWalletGuid { get; set; }
        public string TerminalWalletSymbol { get; set; }
        public DateTime DateAdded { get; set; }

        public ICollection<Transfer> Transfer { get; set; }
    }
}