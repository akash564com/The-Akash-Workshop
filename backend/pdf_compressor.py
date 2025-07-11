import fitz  # PyMuPDF

def compress_pdf(input_path, output_path, quality=60):
    """
    Compress PDF by reducing image quality and removing unused objects.
    """
    doc = fitz.open(input_path)

    for page in doc:
        images = page.get_images(full=True)
        for img_index, img in enumerate(images):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            img_ext = base_image["ext"]

            # Re-encode image at lower quality (as JPEG)
            img_pix = fitz.Pixmap(doc, xref)
            if img_pix.n > 4:  # CMYK
                img_pix = fitz.Pixmap(fitz.csRGB, img_pix)
            img_pix.save(output_path + "_temp.jpg", quality=quality)

            # Replace image in PDF
            page.replace_image(xref, output_path + "_temp.jpg")

    doc.save(output_path, garbage=4, deflate=True, clean=True)
    doc.close()
