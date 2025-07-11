document.getElementById("certificateForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Show loading state (optional)
  const submitBtn = form.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  submitBtn.textContent = "Generating...";

  try {
    const response = await fetch("/generate-certificates", {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Server Error");

    // Get filename from response
    const blob = await response.blob();
    const zipURL = window.URL.createObjectURL(blob);

    document.getElementById("result").classList.remove("hidden");
    document.getElementById("downloadLink").href = zipURL;
    document.getElementById("downloadLink").download = "certificates.zip";
  } catch (err) {
    alert("Something went wrong: " + err.message);
  }

  submitBtn.disabled = false;
  submitBtn.textContent = "Generate Certificates";
});
