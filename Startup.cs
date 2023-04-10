using BTrackerWeb.EF;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Okta.AspNetCore;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;

using Microsoft.Extensions.Hosting;
using BTrackerWeb.Misc;
using System;
using Microsoft.OpenApi.Models;

namespace BTrackerWeb
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //for debugging
            string secretKey = Environment.GetEnvironmentVariable("BINANCE_SECRET_KEY");
            Console.WriteLine("secretKey : ");
            Console.WriteLine(secretKey);

            services.AddControllersWithViews();
            services.AddSignalR();
            services.AddCors(options =>
            {

                // The CORS policy is open for testing purposes. In a production application, you should restrict it to known origins.
                options.AddPolicy(
                    "AllowAll",
                    builder => builder
                                    .AllowAnyOrigin()
                                      .AllowAnyMethod()
                                      .AllowAnyHeader()
                                      .WithOrigins("http://localhost","http://localhost:8100","http://localhost:3000", "http://localhost:5222", "http://www.dspx.eu", "http://dspx.eu")
                                        .AllowCredentials());

            });

            services.AddAuthentication(options =>
           {
               options.DefaultAuthenticateScheme = OktaDefaults.ApiAuthenticationScheme;
               options.DefaultChallengeScheme = OktaDefaults.ApiAuthenticationScheme;
               options.DefaultSignInScheme = OktaDefaults.ApiAuthenticationScheme;
           })
           .AddOktaWebApi(new OktaWebApiOptions
           {
               OktaDomain = "https://dev-792490.okta.com",

           });

            services.AddDbContextPool<ApplicationDbContext>(options =>
              options.UseMySql(Configuration.GetConnectionString("DefaultConnection")));

            services.AddControllersWithViews()
            .AddNewtonsoftJson(option =>
            {
                option.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddSwaggerGen(swagger =>
            {
                swagger.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "DSPX Web API ",
                    Version = "v1",
                    Description = "This API has been buiklt by SEBASTIEN DUBOS for dspx",
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseCors("AllowAll");
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<signalRHub>("/signalRHub");

                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
                //options.RoutePrefix = "api";
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                    //spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
                }
            });

        }
    }
}
