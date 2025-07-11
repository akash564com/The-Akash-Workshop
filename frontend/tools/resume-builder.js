document.getElementById("resumeForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  const submitBtn = form.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  submitBtn.textContent = "Generating...";

  try {
    const response = await fetch("/generate-resume", {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Failed to generate resume");

    const blob = await response.blob();
    const pdfURL = window.URL.createObjectURL(blob);

    document.getElementById("result").classList.remove("hidden");
    const link = document.getElementById("downloadLink");
    link.href = pdfURL;
    link.download = "resume.pdf";
  } catch (err) {
    alert("Error: " + err.message);
  }

  submitBtn.disabled = false;
  submitBtn.textContent = "Generate Resume PDF";
});
