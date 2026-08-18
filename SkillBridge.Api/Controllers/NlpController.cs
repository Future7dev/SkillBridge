using Microsoft.AspNetCore.Mvc;
using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SkillBridge.Api.Controllers
{
    public class NlpAnalyzeRequestDto
    {
        public string ResumeText { get; set; } = string.Empty;
        public string JobDescription { get; set; } = string.Empty;
    }

    [ApiController]
    [Route("api/[controller]")]
    public class NlpController : ControllerBase
    {
        private static readonly HttpClient _httpClient = new HttpClient();

        // POST: /api/nlp/analyze (Invokes Python 3.12 NLP Engine)
        [HttpPost("analyze")]
        public async Task<IActionResult> AnalyzeText([FromBody] NlpAnalyzeRequestDto dto)
        {
            if (string.IsNullOrEmpty(dto.ResumeText) && string.IsNullOrEmpty(dto.JobDescription))
            {
                return BadRequest("ResumeText or JobDescription is required.");
            }

            // 1. Try forwarding to Python NLP HTTP Microservice on port 5001
            try
            {
                var content = new StringContent(
                    JsonSerializer.Serialize(dto),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.PostAsync("http://localhost:5001/api/nlp/analyze", content);
                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    return Content(jsonString, "application/json");
                }
            }
            catch
            {
                // Fallback to CLI invocation if HTTP microservice is not active
            }

            // 2. Fallback to CLI Python Process Invocation
            try
            {
                string scriptPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "nlp_service.py");
                if (!System.IO.File.Exists(scriptPath))
                {
                    scriptPath = Path.Combine(Directory.GetCurrentDirectory(), "nlp_service.py");
                }

                if (System.IO.File.Exists(scriptPath))
                {
                    var psi = new ProcessStartInfo
                    {
                        FileName = "python",
                        Arguments = $"\"{scriptPath}\" --cli",
                        RedirectStandardInput = true,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true
                    };

                    using var process = new Process { StartInfo = psi };
                    process.Start();

                    string jsonInput = JsonSerializer.Serialize(dto);
                    await process.StandardInput.WriteAsync(jsonInput);
                    process.StandardInput.Close();

                    string outputJson = await process.StandardOutput.ReadToEndAsync();
                    await process.WaitForExitAsync();

                    if (!string.IsNullOrEmpty(outputJson))
                    {
                        return Content(outputJson, "application/json");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Python CLI invocation note: {ex.Message}");
            }

            return StatusCode(500, new { message = "Failed to execute Python 3.12 NLP engine." });
        }
    }
}
