namespace BTrackerWeb.Class
{
    internal class PayLoad
    {
        public int Dev_Id { get; set; }
        public string Hardware_serial { get; set; }
        public Position Payload_fields { get; set; }
        public PayLoadMetadata Metadata{ get; set; }
    }
}