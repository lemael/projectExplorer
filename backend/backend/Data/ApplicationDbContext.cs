using Microsoft.EntityFrameworkCore;
using backend.Models;


namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // C'est ici que tu définis tes tables
        public DbSet<Product> Products { get; set; }
    }
}