// Controllers/ImageUploadController.cs
using Microsoft.AspNetCore.Mvc;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace backend.Controllers // <--- Ajoute ceci (remplace MyApi par le nom de ton projet)
{
    [ApiController]
    [Route("api/images")]
    public class ImageUploadController : ControllerBase
    {
        private readonly Cloudinary _cloudinary;

        public ImageUploadController()
        {
            // Pense à bien remplacer par tes identifiants Cloudinary
            var account = new Account(
                "dvvgxybs5",
                "338513265267239",
                "e0w0vRhFg9f0HGYO2NRAUqiqVGw"
            );
            _cloudinary = new Cloudinary(account);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
                return BadRequest("Fichier vide.");

            using var stream = imageFile.OpenReadStream();
            
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(imageFile.FileName, stream),
                Folder = "project_explorer",
                UseFilename = true
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
                return BadRequest(uploadResult.Error.Message);

            return Ok(new { 
                url = uploadResult.SecureUrl.ToString(), 
                publicId = uploadResult.PublicId 
            });
        }

      [HttpGet("list")]
      public async Task<IActionResult> GetImages()
      {
          try
          {
              // On utilise l'API de recherche qui est plus moderne et flexible
              var result = await _cloudinary.Search()
                  .Expression("folder:project_explorer") // Filtre par dossier
                  .SortBy("created_at", "desc")          // Les plus récentes en premier
                  .MaxResults(30)
                  .ExecuteAsync();

              if (result.Error != null)
                  return BadRequest(result.Error.Message);

              // On extrait uniquement les URLs sécurisées
              var imageUrls = result.Resources.Select(r => r.SecureUrl).ToList();
              
              return Ok(imageUrls);
          }
          catch (Exception ex)
          {
              return StatusCode(500, $"Erreur interne : {ex.Message}");
          }
      }
    }
}