document.getElementById("pdfCompressorForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  const submitBtn = form.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  submitBtn.textContent = "Compressing...";

  try {
    const response = await fetch("/compress-pdf", {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Compression failed");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    document.getElementById("result").classList.remove("hidden");
    const link = document.getElementById("downloadLink");
    link.href = url;
    link.download = "compressed.pdf";
  } catch (err) {
    alert("❌ Error: " + err.message);
  }

  submitBtn.disabled = false;
  submitBtn.textContent = "Compress PDF";
});
