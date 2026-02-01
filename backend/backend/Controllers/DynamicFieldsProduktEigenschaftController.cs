using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DynamicFieldsProduktEigenschaftController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DynamicFieldsProduktEigenschaftController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/DynamicFields (Pour charger la config dans le Dashboard et la Vitrine)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DynamicFieldProduktEigenschaft>>> GetFields()
        {
            return await _context.DynamicFieldsProduktEigenschaft.ToListAsync();
        }

        // POST: api/DynamicFields/sync (Pour tout sauvegarder d'un coup depuis l'Admin)
        [HttpPost("sync")]
        public async Task<IActionResult> SyncFields(List<DynamicFieldProduktEigenschaft> fields)
        {
            // Approche simple : on vide et on remplace tout pour synchroniser
            var allExisting = await _context.DynamicFieldsProduktEigenschaft.ToListAsync();
            _context.DynamicFieldsProduktEigenschaft.RemoveRange(allExisting);
            
            await _context.DynamicFieldsProduktEigenschaft.AddRangeAsync(fields);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Configuration synchronisée avec succès" });
        }
    }
}