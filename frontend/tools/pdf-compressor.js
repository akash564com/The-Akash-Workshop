document.getElementById("compressBtn").addEventListener("click", async () => {
  const file = document.getElementById("pdfInput").files[0];
  if (!file) return alert("Select a PDF file first");

  const formData = new FormData();
  formData.append("pdf", file);

  const res = await fetch("/compress", {
    method: "POST",
    body: formData
  });

  const result = await res.json();
  if (result.download) {
    window.location.href = result.download;
  } else {
    alert("❌ Error: " + result.error);
  }
});
