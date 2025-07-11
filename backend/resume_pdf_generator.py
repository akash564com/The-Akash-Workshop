from fpdf import FPDF

class ResumePDF:
    def __init__(self, name, email, phone, skills, experience, education, projects):
        self.name = name
        self.email = email
        self.phone = phone
        self.skills = skills
        self.experience = experience
        self.education = education
        self.projects = projects

    def generate(self, filepath):
        pdf = FPDF()
        pdf.add_page()
        pdf.set_auto_page_break(auto=True, margin=15)

        # Header
        pdf.set_font("Helvetica", 'B', 20)
        pdf.cell(0, 10, self.name, ln=True)

        pdf.set_font("Helvetica", '', 12)
        pdf.cell(0, 8, f"Email: {self.email} | Phone: {self.phone}", ln=True)

        pdf.ln(5)

        # Section Helper
        def section(title, content):
            pdf.set_font("Helvetica", 'B', 14)
            pdf.cell(0, 10, title, ln=True)
            pdf.set_font("Helvetica", '', 12)
            pdf.multi_cell(0, 8, content)
            pdf.ln(2)

        section("Skills", self.skills)
        section("Experience", self.experience)
        section("Education", self.education)
        if self.projects:
            section("Projects", self.projects)

        pdf.output(filepath)
