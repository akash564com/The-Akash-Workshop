from flask import Flask, request, send_file, send_from_directory, jsonify
from werkzeug.utils import secure_filename
from generate_certificate import CertificateGenerator
from resume_pdf_generator import ResumePDF
from pdf_compressor import compress_pdf
import os
import zipfile
import uuid
import shutil
import fitz  # PyMuPDF
# Get absolute frontend folder for static serve
frontend_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '../frontend'))
app = Flask(__name__, static_folder=frontend_folder, static_url_path='/')

UPLOAD_FOLDER = 'uploads'
GENERATED_FOLDER = 'generated'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(GENERATED_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve(path):
    return send_from_directory(app.static_folder, path)

@app.route('/generate-certificates', methods=['POST'])
def generate_certificates():
    # Create unique folder for each request
    session_id = str(uuid.uuid4())
    session_folder = os.path.join(GENERATED_FOLDER, session_id)
    os.makedirs(session_folder, exist_ok=True)

    # Get form fields
    title = request.form.get('title')
    course = request.form.get('course')
    date = request.form.get('date')

    # Save files
    csv_file = request.files['csv']
    csv_path = os.path.join(session_folder, secure_filename(csv_file.filename))
    csv_file.save(csv_path)

    logo_path = None
    if 'logo' in request.files and request.files['logo'].filename != '':
        logo_file = request.files['logo']
        logo_path = os.path.join(session_folder, secure_filename(logo_file.filename))
        logo_file.save(logo_path)

    signature_path = None
    if 'signature' in request.files and request.files['signature'].filename != '':
        sig_file = request.files['signature']
        signature_path = os.path.join(session_folder, secure_filename(sig_file.filename))
        sig_file.save(signature_path)

    # Generate PDFs
    cert = CertificateGenerator(
        output_dir=session_folder,
        title=title,
        course=course,
        date=date,
        logo_path=logo_path,
        signature_path=signature_path
    )
    cert.generate_from_csv(csv_path)

    # Create ZIP
    zip_path = f"{session_folder}.zip"
    with zipfile.ZipFile(zip_path, 'w') as zipf:
        for root, _, files in os.walk(session_folder):
            for file in files:
                if file.endswith(".pdf"):
                    file_path = os.path.join(root, file)
                    zipf.write(file_path, arcname=file)

    # Optional: cleanup session_folder later
    shutil.rmtree(session_folder)

    return send_file(zip_path, mimetype='application/zip', as_attachment=True, download_name='certificates.zip')

@app.route('/generate-resume', methods=['POST'])
def generate_resume():
    form = request.form

    # Get form fields
    name = form.get('name')
    email = form.get('email')
    phone = form.get('phone')
    skills = form.get('skills')
    experience = form.get('experience')
    education = form.get('education')
    projects = form.get('projects', '')

    # Create output folder
    resume_folder = 'generated_resumes'
    os.makedirs(resume_folder, exist_ok=True)
    filename = f"{name.replace(' ', '_')}_resume.pdf"
    filepath = os.path.join(resume_folder, filename)

    # Generate PDF
    resume = ResumePDF(name, email, phone, skills, experience, education, projects)
    resume.generate(filepath)

    return send_file(filepath, mimetype='application/pdf', as_attachment=True, download_name="resume.pdf")
app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/compress", methods=["POST"])
def compress_pdf():
    try:
        if 'pdf' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        pdf = request.files['pdf']
        input_path = os.path.join(UPLOAD_FOLDER, pdf.filename)
        pdf.save(input_path)

        # Use PyMuPDF to compress
        doc = fitz.open(input_path)
        for page in doc:
            page.compress()
        compressed_path = os.path.join(UPLOAD_FOLDER, f"compressed_{pdf.filename}")
        doc.save(compressed_path)
        doc.close()

        return jsonify({"success": True, "download": f"/{compressed_path}"})

    except Exception as e:
        return jsonify({"error": f"Compression failed: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
