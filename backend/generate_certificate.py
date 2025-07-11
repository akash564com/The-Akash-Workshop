from fpdf import FPDF
import csv
import os
from PIL import Image

class CertificateGenerator:
    def __init__(self, output_dir, title, course, date, logo_path=None, signature_path=None):
        self.output_dir = output_dir
        self.title = title
        self.course = course
        self.date = date
        self.logo_path = logo_path
        self.signature_path = signature_path

        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

    def generate_from_csv(self, csv_path):
        with open(csv_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                name = row.get("name") or row.get("Name")
                if name:
                    self._create_pdf(name.strip())

    def _create_pdf(self, name):
        pdf = FPDF('L', 'mm', 'A4')
        pdf.add_page()

        # Background
        pdf.set_fill_color(245, 245, 245)
        pdf.rect(0, 0, 297, 210, 'F')

        # Logo (optional)
        if self.logo_path:
            pdf.image(self.logo_path, 10, 10, 30)

        # Title
        pdf.set_font("Helvetica", 'B', 24)
        pdf.cell(0, 40, self.title, ln=True, align='C')

        # Recipient Name
        pdf.set_font("Helvetica", 'B', 32)
        pdf.cell(0, 30, name, ln=True, align='C')

        # Course
        pdf.set_font("Helvetica", '', 18)
        pdf.cell(0, 15, f"For completing the course: {self.course}", ln=True, align='C')

        # Date
        pdf.set_font("Helvetica", '', 14)
        pdf.set_y(-40)
        pdf.cell(0, 10, f"Issued on: {self.date}", align='C')

        # Signature
        if self.signature_path:
            pdf.image(self.signature_path, x=220, y=140, w=50)

        # Save PDF
        filename = f"{name.replace(' ', '_')}.pdf"
        pdf.output(os.path.join(self.output_dir, filename))
