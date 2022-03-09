using System;
using System.Collections.Generic;
using System.Linq;
using BTrackerWeb.EF;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using BTrackerWeb.Class;
using BTrackerWeb.Misc;
using System.Text;
using System.Security.Cryptography;
using System.Net.Http;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Diagnostics.CodeAnalysis;

namespace BTrackerWeb.Controllers
{
    [Route("api/[controller]")]
    public class CryptoController : Controller
    {
        private readonly ApplicationDbContext DbContext;
        private IHubContext<signalRHub> _hub;

        public CryptoController([NotNull] IHubContext<signalRHub> hub, [FromServices] ApplicationDbContext appDbContext)
        {
            _hub = hub;
            DbContext = appDbContext;
        }

        #region Transfer methods

        [HttpGet]
        [Authorize]
        [Route("[Action]")]
        public List<Terminal> GetTerminalList()
        {
            string userId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            if (userId == null) return new List<Terminal>();
            return DbContext.cr_terminal
                .Where(p => p.UserId == userId)
                .Select(p => p).OrderBy(p => p.TerminalId).ToList();
        }

        [HttpPost]
        [Authorize]
        [Route("/api/[controller]/[Action]")]
        public List<Terminal> SaveTerminal([FromBody] Terminal terminal)
        {
            terminal.DateAdded = DateTime.Now;
            terminal.UserId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            DbContext.cr_terminal.Add(terminal);
            DbContext.SaveChanges();
            return GetTerminalList();
        }

        [HttpPost]
        [Authorize]
        [Route("[Action]")]
        public async Task<List<Transfer>> SaveTransferAmount([FromBody] Transfer transfer)
        {
            DbContext.cr_transfer.Add(transfer);
            DbContext.SaveChanges();
            //debug
             //await ArduinoExecTransfer(transfer.TransferId);

            return GetTransferList();
        }

        [HttpGet]
        [Authorize]
        [Route("[Action]")]
        public List<Transfer> GetTransferList()
        {
            string userId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            if (userId == null) return new List<Transfer>();
            return DbContext.cr_transfer
                .Where(p => p.Terminal.UserId == userId && p.TransferIsCompleted != true)
                .Select(p => p).OrderByDescending(p => p.TransferId).ToList();
        }

        #endregion

        #region Binance

        [HttpGet]
        [Authorize]
        [Route("[Action]")]
        public List<CryptoAsset> BinanceBalance()
        {
            try
            {
                string userId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
                string secretKey = Environment.GetEnvironmentVariable("BINANCE_SECRET_KEY");
                string apiKey = DbContext.cr_userKey.Where(predicate => predicate.UserId == userId).Select(p => p.UserApiKey).FirstOrDefault();

                string parameters = $"timestamp={ServerTime(apiKey)}&recvWindow=60000";
                string signature = GetSignature(parameters, secretKey);
                string apiUrl = $"https://api3.binance.com/sapi/v1/asset/get-funding-asset?{parameters}&signature={signature}";

                var result = HttpHelper.PostApiData<List<CryptoAsset>>(new Uri(apiUrl), apiKey, new StringContent("", Encoding.UTF8, "application/json"));
                if (result != null)
                    return result;
                else return new List<CryptoAsset>();
            }
            catch (System.Exception e)
            {
                Console.WriteLine(e);
                return new List<CryptoAsset>();
            }
        }

        [HttpGet]
        [Authorize]
        [Route("[Action]")]
        public List<CryptoTransfer> BinanceTransactionHistory()
        {
            string userId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            string secretKey = Environment.GetEnvironmentVariable("BINANCE_SECRET_KEY");
            string apiKey = DbContext.cr_userKey.Where(predicate => predicate.UserId == userId).Select(p => p.UserApiKey).FirstOrDefault();

            string parameters = $"timestamp={ServerTime(apiKey)}&recvWindow=60000&type=MAIN_FUNDING";
            string signature = GetSignature(parameters, secretKey);
            string apiUrl = $"https://api3.binance.com/sapi/v1/asset/transfer?{parameters}&signature={signature}";

            var result = HttpHelper.GetApiData<CryptoTransferParent>(new Uri(apiUrl), apiKey).Rows;
            if (result != null)
                return result.ToList();
            else return new List<CryptoTransfer>();
        }

        [HttpGet]
        [Route("[Action]")]
        private async void BinanceExecuteTransfer(decimal amount)
        {
            amount = 2;
            string amount2 = amount.ToString().Replace(",",".");
            try
            {
                 Console.WriteLine("Start binance transfer");
                  Console.WriteLine("amount : " + amount.ToString());
                    Console.WriteLine("amount2 : " + amount2);
                string secretKey = Environment.GetEnvironmentVariable("BINANCE_SECRET_KEY");
                string apiKey = "lJ1rj5uEaCGEzd6RdXE5P6Em7oEc1Kp0bMXbcy7MoKFNEaajhEr873xzAkX5C2Px";
                  Console.WriteLine("secretKey : " + secretKey);
                  Console.WriteLine("apiKey : " + apiKey);
                  Console.WriteLine("amount : " + amount.ToString());

                string parameters = $"timestamp={ServerTime(apiKey)}&recvWindow=60000&type=MAIN_FUNDING&asset=ADA&amount={amount2}";
                string signature = GetSignature(parameters, secretKey);
                string apiUrl = $"https://api3.binance.com/sapi/v1/asset/transfer?{parameters}&signature={signature}";

                Console.WriteLine(apiUrl);
                HttpHelper.PostApiData<CryptoTransaction>(new Uri(apiUrl), apiKey, new StringContent("", Encoding.UTF8, "application/json"));
                Console.WriteLine("http request completed");
                await _hub.Clients.All.SendAsync("transferExecuted", "done");
            }
            catch (System.Exception e)
            {
                Console.WriteLine(e);
            }
        }

        #endregion

        #region Arduino methods

        [HttpGet]
        [Route("[Action]")]
        public CryptoArduinoTransfer ArduinoGetTransfer()
        {
            CryptoArduinoTransfer myArduinoTransfer = DbContext.cr_transfer
                .Where(p => p.TransferIsCompleted != true)
                .Select(p => new CryptoArduinoTransfer()
                {
                    TerminalId = p.TerminalId,
                    TransferAmount = "(" + p.TransferAmount.ToString() + "ada)",
                    TransferAmountRequested = p.TransferAmountRequested.ToString() + " " + p.TransferSymbol,
                    TransferId = p.TransferId,
                    TransferIsCompleted = p.TransferIsCompleted,
                    TransferSymbol = p.TransferSymbol
                }).FirstOrDefault();

            return myArduinoTransfer;
        }

        [HttpGet]
        [Route("[Action]/{id}")]
        public async Task<string> ArduinoExecTransfer(int id)
        {
            Transfer myTransfert = DbContext.cr_transfer.Where(p => p.TransferId == id).FirstOrDefault();
            myTransfert.TransferIsCompleted = true;
            DbContext.cr_transfer.Update(myTransfert);
            DbContext.SaveChanges();

            if (IsAppTestMode())
            {
               await _hub.Clients.All.SendAsync("transferExecuted", "done");
            }
            else
            {
                BinanceExecuteTransfer(myTransfert.TransferAmount);
            }

            return id.ToString();
        }

        #endregion

        #region Helper

        private bool IsAppTestMode()
        {
            return DbContext.cr_setting.Where(p => p.SettingName == "TestMode").Select(p => p.SettingValue).FirstOrDefault();
        }

        [HttpGet]
        [Authorize]
        [Route("[Action]")]
        public bool GetAppMode()
        {
            return IsAppTestMode();
        }

        [HttpGet]
        [Authorize]
        [Route("[Action]")]
        public bool UpdateAppMode()
        {
            Setting mySetting = DbContext.cr_setting.Where(p => p.SettingName == "TestMode").FirstOrDefault();
            mySetting.SettingValue = !mySetting.SettingValue;
            DbContext.cr_setting.Update(mySetting);
            DbContext.SaveChanges();
            return mySetting.SettingValue;
        }

        private static long ServerTime(string apiKey)
        {
            string apiUrl = string.Format("https://api.binance.com/api/v3/time");
            CryptoTimeStamp result = HttpHelper.GetApiData<CryptoTimeStamp>(new Uri(apiUrl), apiKey);
            return result.ServerTime;
        }

        private static string GetSignature(string totalParams, string secretKey)
        {
            byte[] keyBytes = Encoding.UTF8.GetBytes(secretKey);
            byte[] messageBytes = Encoding.UTF8.GetBytes(totalParams);
            HMACSHA256 hmacsha256 = new HMACSHA256(keyBytes);
            byte[] bytes = hmacsha256.ComputeHash(messageBytes);
            return BitConverter.ToString(bytes).Replace("-", "").ToLower();
        }

        private static long GetTimestamp()
        {
            return new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds();
        }

        #endregion
    }
}