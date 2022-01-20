using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace BTrackerWeb.Misc
{
    public class signalRHub : Hub
    {
        public async Task SendMessage(string msg)
        {
            await Clients.All.SendAsync("messageReceived", msg);
        }
    }
}