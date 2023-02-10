using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BTrackerWeb.EF
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public virtual DbSet<GpsPosition> GpsPosition { get; set; }
        public virtual DbSet<Device> Device { get; set; }
        public virtual DbSet<SmartHouse> SmartHouse { get; set; }
        public virtual DbSet<SmartHouseUser> SmartHouseUser { get; set; }
        public virtual DbSet<SmartHouseEntry> SmartHouseEntry { get; set; }
        public virtual DbSet<LogBook> pl_logBook { get; set; }
        public virtual DbSet<AircraftModel> pl_aircraftModel { get; set; }
        public virtual DbSet<Airport> pl_airport { get; set; }
        public virtual DbSet<FlightPlan> pl_flightPlan { get; set; }
        public virtual DbSet<WayPoint> pl_wayPoint { get; set; }
        public virtual DbSet<Transfer> cr_transfer { get; set; }
        public virtual DbSet<Terminal> cr_terminal { get; set; }
        public virtual DbSet<Symbol> cr_symbol { get; set; }
        public virtual DbSet<Currency> cr_currency { get; set; }
        public virtual DbSet<Setting> cr_setting { get; set; }
        public virtual DbSet<UserKey> cr_userKey { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //SD : Needed for compatibility MySql entityframework
            builder.Entity<ApplicationUser>(entity => entity.Property(m => m.Id)
                .HasMaxLength(255));
            builder.Entity<ApplicationUser>(entity => entity.Property(m => m.NormalizedEmail)
                .HasMaxLength(255));
            builder.Entity<ApplicationUser>(entity => entity.Property(m => m.NormalizedUserName)
                .HasMaxLength(255));

            builder.Entity<IdentityRole>(entity => entity.Property(m => m.Id)
                .HasMaxLength(255));
            builder.Entity<IdentityRole>(entity => entity.Property(m => m.NormalizedName)
                .HasMaxLength(255));

            builder.Entity<IdentityUserLogin<string>>(entity => entity.Property(m => m.LoginProvider)
                .HasMaxLength(255));
            builder.Entity<IdentityUserLogin<string>>(entity => entity.Property(m => m.ProviderKey)
                .HasMaxLength(255));
            builder.Entity<IdentityUserLogin<string>>(entity => entity.Property(m => m.UserId)
                .HasMaxLength(255));

            builder.Entity<IdentityUserRole<string>>(entity => entity.Property(m => m.UserId)
                .HasMaxLength(255));
            builder.Entity<IdentityUserRole<string>>(entity => entity.Property(m => m.RoleId)
                .HasMaxLength(255));

            builder.Entity<IdentityUserToken<string>>(entity => entity.Property(m => m.UserId)
                .HasMaxLength(255));
            builder.Entity<IdentityUserToken<string>>(entity => entity.Property(m => m.LoginProvider)
                .HasMaxLength(255));
            builder.Entity<IdentityUserToken<string>>(entity => entity.Property(m => m.Name)
                .HasMaxLength(255));

            builder.Entity<IdentityUserClaim<string>>(entity => entity.Property(m => m.Id)
                .HasMaxLength(255));
            builder.Entity<IdentityUserClaim<string>>(entity => entity.Property(m => m.UserId)
                .HasMaxLength(255));
            builder.Entity<IdentityRoleClaim<string>>(entity => entity.Property(m => m.Id)
                .HasMaxLength(255));
            builder.Entity<IdentityRoleClaim<string>>(entity => entity.Property(m => m.RoleId)
                .HasMaxLength(255));
        }
    }
}