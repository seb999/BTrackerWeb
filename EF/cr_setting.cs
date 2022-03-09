using System;
using System.Collections.Generic;

namespace BTrackerWeb.EF
{
    public class Setting
    {
        public int SettingId { get; set; }
        public string SettingName { get; set; }
        public bool SettingValue { get; set; }
    }
}