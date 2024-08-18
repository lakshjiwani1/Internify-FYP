from django.shortcuts import render
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from .models import ResumeInfo
import spacy
from authentication.models import Student
# from .spacy_model import nlp  # Assuming spacy_model.py is in the same app
import PyPDF2
import docx
import json
import os
from django.conf import settings
from django.contrib.auth import get_user_model
from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as genai
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.enums import TA_CENTER
# from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


def extract_text_from_pdf(file_path):
    text = ""
    with open(file_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            # page = reader.pages[page_num]
            text += page.extract_text()
    return text 

# @csrf_exempt
def extract_text_from_docx(request):
    if request.method == 'POST':
        print(request.FILES)
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file uploaded'}, status=400)
        try:
            file = request.FILES['file']
            temp_dir = os.path.join(settings.MEDIA_ROOT, 'student_cvs/')
            if not os.path.exists(temp_dir):
                os.makedirs(temp_dir)
            saved_file_path = default_storage.save('student_cvs/' + file.name, file)
            print(f"saved_file_path: {saved_file_path}")
            # Extract filename from the saved file path
            saved_file_name = os.path.basename(saved_file_path)
            print(f"saved_file_name: {saved_file_name}")
            text = ""
            doc = docx.Document(os.path.join(settings.MEDIA_ROOT, saved_file_path))
            for para in doc.paragraphs:
                text += para.text + "\n"

            resume_response = {
                'text': text
            }
            # return JsonResponse({'response_data': resume_response})
            return text
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def extract_data_from_resume(request):
    if request.method == 'POST':
        print(request.FILES)
        try:
            file = request.FILES['file']
            print(f"File Information: {file}")
            file_path = default_storage.save(f'student_cvs/{file.name}', file)
            print(f"File Path: {file_path}")
            full_file_path = os.path.join(settings.MEDIA_ROOT, file_path)
            print(f"Full File Path: {full_file_path}")
            file_extension = file.name.split('.')[-1].lower()

            if file_extension == 'pdf':
                text = extract_text_from_pdf(full_file_path)
                print(f"Resume Text: \n{text}")
            model_path = os.path.join(settings.BASE_DIR, "F:\FYP\Git\Internify-FYP\Internify\Backend\output", 'model-best')            
            print(f"Model Path: {model_path}")
            nlp = spacy.load(model_path)
            print(f"Model Loaded Successfully {nlp}")
            # Add the sentencizer component to the pipeline
            nlp.add_pipe('sentencizer')
            doc = nlp(text)
            print(f"Doc: {doc}")
            education = []
            skills = []
            for ent in doc.ents:
                if ent.label_ == "Education":
                    education.append(ent.text)
                elif ent.label_ == "Skills":
                    skills.append(ent.text)
            print(f"skills: {skills}")
            print(f"Education: {education}")
            summary = ' '.join([sent.text for sent in doc.sents])
            response_data = {
            'skills': skills,
            'education_fields': education,
            'summary': summary,
        }
            return JsonResponse(response_data, status=200)
        except Exception as e:
            print(f"Error: {str(e)}")  # Log the error
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
            



@csrf_exempt
def analyze_resume(request):
    user_id = 48
    User = get_user_model()
    user = User.objects.get(pk=user_id)
    print(user)
    if request.method == 'POST':
        print(request.FILES)
        try:
            # user = request.user  # Assuming user is authenticated
            print(f"User ID: {user.id}")
            print(f"User Information: {user}")
            student = Student.objects.get(user=user)
            print(f"Student ID: {student.id}")
            print(f"Student Information: {student}")
            file = request.FILES['file']
            print(f"File Information: {file}")
            file_path = default_storage.save(f'student_cvs/{file.name}', file)
            print(f"File Path: {file_path}")
            full_file_path = os.path.join(settings.MEDIA_ROOT, file_path)
            print(f"Full File Path: {full_file_path}")
            file_extension = file.name.split('.')[-1].lower()
            
            if file_extension == 'pdf':
                text = extract_text_from_pdf(full_file_path)
                print(f"Resume Text: \n{text}")
            elif file_extension == 'docx':
                text = extract_text_from_docx(full_file_path)
            else:
                return JsonResponse({'error': 'Unsupported file type'}, status=400)

            if not text:
                return JsonResponse({'error': 'Failed to extract text from file'}, status=400)

            # Load the trained spaCy model
            # model_path = os.path.join(settings.BASE_DIR, 'F:\\FYP\\Git\\Internify-FYP\\Internify\\Backend\\', 'spacy_model')  # Update this path
            model_path = os.path.join(settings.BASE_DIR, "F:\FYP\Git\Internify-FYP\Internify\Backend\output", 'model-best')            
            print(f"Model Path: {model_path}")
            nlp = spacy.load(model_path)
            print(f"Model Loaded Successfully {nlp}")
            # Add the sentencizer component to the pipeline
            nlp.add_pipe('sentencizer')
            doc = nlp(text)
            education = []
            skills = []
            for ent in doc.ents:
                if ent.label == "Education":
                    education.append(ent.text)
                elif ent.label == "Skills":
                    skills.append(ent.text)
            
            # skills = [ent.text for ent in doc.ents if ent.label_ == 'SKILLS']
            print(f"Skills: {skills}")
            # education_fields = [ent.text for ent in doc.ents if ent.label_ == 'EDUCATION']
            print(f"Education: {education}")
            summary = ' '.join([sent.text for sent in doc.sents])
            # print(f"Summary: {summary}")

            response_data = {
                'skills': skills,
                'education_fields': education,
                'summary': summary,
            }
            return JsonResponse(response_data, status=200)
        except Exception as e:
            print(f"Error: {str(e)}")  # Log the error
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_resume(request):
    if request.method == 'POST':
        try:
            # Extract token from headers
            auth_header = request.headers.get('Authorization', None)
            if not auth_header:
                return JsonResponse({'error': 'Authorization header missing'}, status=401)

            token = auth_header.split(' ')[1]  # Bearer token
            jwt_auth = JWTAuthentication()
            validated_token = jwt_auth.get_validated_token(token)
            user_id = jwt_auth.get_user(validated_token).id

            # Get user and student
            User = get_user_model()
            user = User.objects.get(pk=user_id)
            print(f"User ID: {user.id}")
            print(f"User Information: {user}")
            student = Student.objects.get(user=user)
            print(f"Student ID: {student.id}")
            print(f"Student Information: {student}")

            data = json.loads(request.body)
            skills = data.get('skills', [])
            education_fields = data.get('education_fields', [])
            summary = data.get('summary', '')
            
            # Get or create ResumeInfo object
            resume, created = ResumeInfo.objects.get_or_create(student=user)
            resume.skills = ', '.join(skills)
            resume.education = ', '.join(education_fields)
            resume.summary = summary
            resume.save()

            response_data = {
                'message': 'Resume saved successfully',
                'resume_id': resume.id
            }
            return JsonResponse(response_data, status=200)
        except InvalidToken:
            return JsonResponse({'error': 'Invalid or expired token'}, status=401)
        except Exception as e:
            print(f"Error: {str(e)}")  # Log the error
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def initialize_gemini_api(api_key):

    os.environ['GOOGLE_API_KEY'] = api_key

    # GOOGLE_API_KEY=api_key

    # Get the API key from the environment variables
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

    # Verify the API key is loaded
    print(f"GOOGLE_API_KEY: {GOOGLE_API_KEY}")

    # Assuming `genai` is a module or library you are using
    # Replace `genai.configure` with the appropriate configuration function
    # genai.configure(api_key=GOOGLE_API_KEY)
    genai.configure(api_key=GOOGLE_API_KEY)

def remove_asterisks(content):
    # Replace all asterisks with an empty string
    return content.replace('*', '')



def save_resume_as_pdf(content, filename="resume.pdf", user_info=None):
    if user_info is None:
        user_info = {'name': 'John Doe', 'phone': '123-456-7890'}  # Default user info
    content = remove_asterisks(content)
    c = canvas.Canvas(filename)
    width, height = letter

    # Set initial y position
    y_position = height - 72

    # Function to draw text with automatic wrapping
    def draw_text(text, y_pos, max_width, font_size=12, font="Times-Roman", left_margin=56.7, right_margin=56.7, top_margin=56.7, bottom_margin=56.7, bold=False, align=None):
        style = getSampleStyleSheet()['Normal']
        style.fontName = font
        style.fontSize = font_size
        if bold:
            style.fontName = 'Times-Bold'
        if align == 'center':
            style.alignment = TA_CENTER
        p = Paragraph(text, style)
        p.wrapOn(c, max_width - (left_margin + right_margin), 0)
        p.drawOn(c, left_margin, y_pos - p.height)
        return y_pos - p.height - 4

    # Split the content into lines
    lines = content.split('\n')

    # Draw the name at the top in bold and centered
    c.setFont("Times-Bold", 16)
    c.drawCentredString(width / 2, y_position, user_info['name'])
    y_position -= 20  # Adjust for larger font size

    # Draw the phone number below the name in normal text
    c.setFont("Times-Roman", 12)
    c.drawString(72, y_position, f"Phone: {user_info['email']}")
    y_position -= 18  # Adjust for normal font size

    # # Draw the phone number below the name in normal text
    # c.setFont("Times-Roman", 12)
    # c.drawString(72, y_position, f"Email: {user_info['email']}")
    # y_position -= 16

    # Draw each line with formatting
    for line in lines:
        if line.strip() in ["Professional Summary", "Education", "Skills", "Certifications and Awards"]:
            y_position = draw_text(line.strip(), y_position, width - 72, font_size=14, bold=True)
        else:
            y_position = draw_text(line.strip(), y_position, width - 72)

    c.showPage()
    c.save()
    print(f"Resume saved to {filename}")


def generate_resume(request):
    api_key = 'AIzaSyAl5qBDoGd_M1k09zRfbAHmK3soGfnacVw'
    initialize_gemini_api(api_key)
    llm = ChatGoogleGenerativeAI(model="gemini-pro")

    headings = {
    "Professional Summary": "Professional Summary",
    "Education": "Education",
    "Skills": "Skills",
    "Certifications & Awards": "Certifications & Awards",
    "Additional Experience": "Additional Information"
    }
    
    user_id = 59
    User = get_user_model()
    user = User.objects.get(pk=user_id)
    print(f"User ID: {user.id}")
    print(f"User Information: {user}")
    student = Student.objects.get(user=user)
    print(f"Student ID: {student.id}")
    print(f"Student Information: {student}")
    print(f"Student First Name: {student.first_name}")
    print(f"Student Last Name: {student.last_name}")
    print(f"Student Email: {student.email}")
    resume, created = ResumeInfo.objects.get_or_create(student=user)
    print(f"Resume: {resume}")
    print(f"Education from Resume: {resume.education}")
    print(f"Resume Skills: {resume.skills}")

    user_info = {
        "name": student.first_name + student.last_name,
        "last_name": student.last_name,
        "email": student.email,
        "skills": resume.skills,
        "education": resume.education
    }

    prompt = f"""
    You are a professional resume writer. Your task is to create an ATS-friendly resume based on the following user details:

    Name: {user_info['name']}
    Email: {user_info['email']}
    Education: {user_info['education']}
    Skills: {', '.join(user_info['skills'])}

    Please ensure the resume is formatted in a clean and professional manner, suitable for Applicant Tracking Systems (ATS). The resume should include the following sections:

    1. Contact Information
    2. Professional Summary
    3. Education
    4. Skills
    6. Certifications and Awards (if available)

    Use the details provided to craft a compelling and concise resume. Make sure to use bullet points for easy readability in the skills and work experience sections. Highlight the most relevant skills and education qualifications that match typical job descriptions in the user's field. Ensure the formatting is simple and avoids graphics or complex layouts that might not be parsed correctly by ATS software.
    """
    result = llm.invoke(prompt)
    print(result)
    save_resume_as_pdf(result.content, user_info=user_info)
    return JsonResponse({'success': True, 'user_info': user_info})