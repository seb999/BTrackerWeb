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

namespace BTrackerWeb.Controllers
{
    [Route("api/[controller]")]
    public class CryptoController : Controller
    {
        private readonly ApplicationDbContext DbContext;
 
        public CryptoController([FromServices] ApplicationDbContext appDbContext)
        {
            DbContext = appDbContext;
        }

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

        [HttpGet]
        [Authorize]
        [Route("[Action]")]
        public List<Transfer> GetTransferList()
        {
            string userId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            if (userId == null) return new List<Transfer>();
            return DbContext.cr_transfer
                .Where(p => p.Terminal.UserId == userId && p.TransferIsCompleted!=true)
                .Select(p => p).OrderByDescending(p => p.TransferId).ToList();
        }

        [HttpGet]
        [Route("[Action]")]
        public Transfer GetTransfer()
        {
            return DbContext.cr_transfer.Where(p=>p.TransferIsCompleted!=true).Select(p=>p).FirstOrDefault();
        }

        [HttpGet]
        [Route("[Action]")]
        public void ValidateTransfer(int terminalId)
        {
            Transfer myTransfert =  DbContext.cr_transfer.Where(p => p.TerminalId == terminalId).FirstOrDefault();
            BinanceExecuteTransfer(myTransfert.TransferAmount);
        }

        [HttpPost]
        [Authorize]
        [Route("[Action]")]
        public List<Transfer> SaveTransferAmount([FromBody] Transfer transfer)
        {
            DbContext.cr_transfer.Add(transfer);
            DbContext.SaveChanges();
            return GetTransferList();
        }

        [HttpGet]
        [Route("[Action]")]
        public Transfer GetTransferAmount(int terminalId)
        {
            return DbContext.cr_transfer.Where(p => p.TerminalId == terminalId).FirstOrDefault();
        }

        [HttpGet]
        [Route("[Action]")]
        public Transfer DeleteRequestAmount(int terminalId)
        {
            Transfer toBeDelted = DbContext.cr_transfer.Where(p => p.TerminalId == terminalId).FirstOrDefault();
            DbContext.cr_transfer.Remove(toBeDelted);
            DbContext.SaveChanges();
            return GetTransferAmount(terminalId);
        }

        [HttpGet]
        [Authorize]
        [Route("[Action]")]
        public List<CryptoAsset> BinanceBalance()
        {
            string userId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            //string secretKey = DbContext.cr_userKey.Where(predicate=>predicate.UserId == userId).Select(p=>p.UserSecretKey).FirstOrDefault();
            string secretKey = Environment.GetEnvironmentVariable("BINANCE_SECRET_KEY",EnvironmentVariableTarget.Process);
            string apiKey = DbContext.cr_userKey.Where(predicate=>predicate.UserId == userId).Select(p=>p.UserApiKey).FirstOrDefault();

            string parameters = $"timestamp={ServerTime(apiKey)}&recvWindow=60000";
            string signature = GetSignature(parameters, secretKey);
            string apiUrl = $"https://api3.binance.com/sapi/v1/asset/get-funding-asset?{parameters}&signature={signature}";

            return  HttpHelper.PostApiData<List<CryptoAsset>>(new Uri(apiUrl), apiKey, new StringContent("", Encoding.UTF8, "application/json"));          
        }

        [HttpGet]
        [Authorize]
        [Route("[Action]")]
        public List<CryptoTransfer> BinanceTransactionHistory()
        {
            string userId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            //string secretKey = DbContext.cr_userKey.Where(predicate=>predicate.UserId == userId).Select(p=>p.UserSecretKey).FirstOrDefault();
            string secretKey = Environment.GetEnvironmentVariable("BINANCE_SECRET_KEY", EnvironmentVariableTarget.Process);
            string apiKey = DbContext.cr_userKey.Where(predicate=>predicate.UserId == userId).Select(p=>p.UserApiKey).FirstOrDefault();

            string parameters = $"timestamp={ServerTime(apiKey)}&recvWindow=60000&type=MAIN_FUNDING";
            string signature = GetSignature(parameters, secretKey);
            string apiUrl = $"https://api3.binance.com/sapi/v1/asset/transfer?{parameters}&signature={signature}";
 
            return HttpHelper.GetApiData<CryptoTransferParent>(new Uri(apiUrl), apiKey).Rows;            
        }
        
        [HttpGet]
        [Route("[Action]")]
        public object BinanceExecuteTransfer(decimal amount)
        {
            //Get number of ADA from UI (convert euros requested into ADA and call this method)
            string userId = DbContext.Users.Where(p => p.Email == User.Claims.Last().Value).Select(p => p.Id).FirstOrDefault();
            //string secretKey = DbContext.cr_userKey.Where(predicate=>predicate.UserId == userId).Select(p=>p.UserSecretKey).FirstOrDefault();
            string secretKey = Environment.GetEnvironmentVariable("BINANCE_SECRET_KEY",EnvironmentVariableTarget.Process);
            string apiKey = DbContext.cr_userKey.Where(predicate=>predicate.UserId == userId).Select(p=>p.UserApiKey).FirstOrDefault();

            string parameters = $"timestamp={ServerTime(apiKey)}&recvWindow=60000&type=MAIN_FUNDING&asset=ADA&amount={amount}";
            string signature = GetSignature(parameters, secretKey);
            string apiUrl = $"https://api3.binance.com/sapi/v1/asset/transfer?{parameters}&signature={signature}";

            return  HttpHelper.PostApiData<List<CryptoAsset>>(new Uri(apiUrl), apiKey, new StringContent("", Encoding.UTF8, "application/json"));                    
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
    }
}