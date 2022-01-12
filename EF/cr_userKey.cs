using System;
using System.Collections.Generic;

namespace BTrackerWeb.EF
{
    public class UserKey
    {
        public int UserKeyId { get; set; }
        public string UserId { get; set; }
        public string UserApiKey { get; set; }
        public string UserSecretKey { get; set; }
        public DateTime DateAdded { get; set; }
        
    }
}