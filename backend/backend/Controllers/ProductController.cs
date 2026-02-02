
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers // <--- Ajoute ceci (remplace MyApi par le nom de ton projet)
{

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductsController(ApplicationDbContext context) => _context = context;

    // GET: api/products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        return await _context.Products.ToListAsync();
    }

    // PATCH: api/products/1
    [HttpPatch("{id}")]
public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product updatedProduct)
{
    var product = await _context.Products.FindAsync(id);
    if (product == null) return NotFound();

    // On met à jour les champs. 
    // Note : updatedProduct.Id sera probablement 0 ou l'ID envoyé, 
    // mais on utilise l'ID de l'URL pour la sécurité.
    if (!string.IsNullOrEmpty(updatedProduct.Description)) 
        product.Description = updatedProduct.Description;
        
    if (!string.IsNullOrEmpty(updatedProduct.Image)) 
        product.Image = updatedProduct.Image;

    await _context.SaveChangesAsync();
    return NoContent();
}

    [HttpPost]
public async Task<ActionResult<Product>> PostProduct(Product product)
{
    _context.Products.Add(product);
    await _context.SaveChangesAsync();

    // Retourne le produit créé avec son nouvel ID généré par la base de données
    return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product);
}
}
}