using System.Collections.Generic;
using System.Linq;
using BTrackerWeb.EF;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using BTrackerWeb.Class;

namespace BTrackerWeb.Controllers
{
    [Route("api/[controller]")]
    public class CryptoPaymentController : Controller
    {
        private readonly ApplicationDbContext DbContext;

        public CryptoPaymentController([FromServices] ApplicationDbContext appDbContext)
        {
            DbContext = appDbContext;
        }

        [HttpGet]
        [Route("[Action]")]
        public RequestTrans GetRequestAmount(string userId)
        {
            //  return DbContext.cry_requestTrans
            //     .Where(p => p.UserId == userId).FirstOrDefault();
            return DbContext.cry_requestTrans.FirstOrDefault();
        }
    }
}