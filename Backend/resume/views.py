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

# @csrf_exempt
# def extract_text_from_pdf(request):
#     if request.method == 'POST':
#         print(request.FILES)
#         if 'file' not in request.FILES:
#             return JsonResponse({'error': 'No file uploaded'}, status=400)
#         try:
#             file = request.FILES['file']
#             temp_dir = os.path.join(settings.MEDIA_ROOT, 'student_cvs/')
#             if not os.path.exists(temp_dir):
#                 os.makedirs(temp_dir)
#             saved_file_path = default_storage.save('student_cvs/' + file.name, file)
#             print(f"saved_file_path: {saved_file_path}")
#             # Extract filename from the saved file path
#             saved_file_name = os.path.basename(saved_file_path)
#             print(f"saved_file_name: {saved_file_name}")
#             text = ""
#             with open(os.path.join(settings.MEDIA_ROOT, saved_file_path), 'rb') as f:
#                 reader = PyPDF2.PdfReader(f)
#                 for page in reader.pages:
#                     # page = reader.pages[page_num]
#                     text += page.extract_text()

#             resume_response = {
#                 'text': text
#             }
#             return text
#             # return JsonResponse({'response_data': resume_response})
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=400)
#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=405)

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
    
# @csrf_exempt
# def analyze_resume(request):
#     if request.method == 'POST':
#         print(request.FILES)
#         try:
#             user = request.user  # Assuming user is authenticated
#             print(f"User ID: {user.id}")
#             print(f"User Information: {user}")
#             student = Student.objects.get(user=user)
#             print(f"Student ID: {student.id}")
#             print(f"Student Information: {student}")
#             file = request.FILES['file']
#             print(f"File Information: {file}")
#             file_path = default_storage.save(f'student_cvs/{file.name}', file)
#             print(f"File Path: {file_path}")
#             full_file_path = os.path.join(settings.MEDIA_ROOT, file_path)
#             print(f"Full File Path: {full_file_path}")
#             file_extension = file.name.split('.')[-1].lower()

#             if file_extension == 'pdf':
#                 text = extract_text_from_pdf(full_file_path)
#             elif file_extension == 'docx':
#                 text = extract_text_from_docx(full_file_path)
#             else:
#                 return JsonResponse({'error': 'Unsupported file type'}, status=400)

#             if not text:
#                 return JsonResponse({'error': 'Failed to extract text from file'}, status=400)

#             # Load the trained spaCy model
#             model_path = os.path.join(settings.BASE_DIR, 'F:\\FYP\\Git\\Internify-FYP\\Internify\\Backend\\', 'spacy_model')  # Update this path
#             print(f"Model Path: {model_path}")
#             nlp = spacy.load(model_path)
#             print(f"Model Loaded Successfully {nlp}")
#             # Add the sentencizer component to the pipeline
#             nlp.add_pipe('sentencizer')
#             doc = nlp(text)

#             skills = [ent.text for ent in doc.ents if ent.label_ == 'SKILLS']
#             print(f"Skills: {skills}")
#             education_fields = [ent.text for ent in doc.ents if ent.label_ == 'EDUCATION']
#             print(f"Education: {education_fields}")
#             summary = ' '.join([sent.text for sent in doc.sents])
#             # print(f"Summary: {summary}")
            
#             resume, created = ResumeInfo.objects.get_or_create(student=user)
#             resume.skills = ', '.join(skills)
#             resume.education = ', '.join(education_fields)
#             resume.summary = summary
#             resume.save()

#             response_data = {
#                 'skills': skills,
#                 'education_fields': education_fields,
#                 'summary': summary,
#             }
#             return JsonResponse(response_data, status=200)
#         except Exception as e:
#             print(f"Error: {str(e)}")  # Log the error
#             return JsonResponse({'error': str(e)}, status=400)
#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def analyze_resume(request):
    if request.method == 'POST':
        print(request.FILES)
        try:
            user = request.user  # Assuming user is authenticated
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
            elif file_extension == 'docx':
                text = extract_text_from_docx(full_file_path)
            else:
                return JsonResponse({'error': 'Unsupported file type'}, status=400)

            if not text:
                return JsonResponse({'error': 'Failed to extract text from file'}, status=400)

            # Load the trained spaCy model
            model_path = os.path.join(settings.BASE_DIR, 'F:\\FYP\\Git\\Internify-FYP\\Internify\\Backend\\', 'spacy_model')  # Update this path
            print(f"Model Path: {model_path}")
            nlp = spacy.load(model_path)
            print(f"Model Loaded Successfully {nlp}")
            # Add the sentencizer component to the pipeline
            nlp.add_pipe('sentencizer')
            doc = nlp(text)

            skills = [ent.text for ent in doc.ents if ent.label_ == 'SKILLS']
            print(f"Skills: {skills}")
            education_fields = [ent.text for ent in doc.ents if ent.label_ == 'EDUCATION']
            print(f"Education: {education_fields}")
            summary = ' '.join([sent.text for sent in doc.sents])
            # print(f"Summary: {summary}")

            response_data = {
                'skills': skills,
                'education_fields': education_fields,
                'summary': summary,
            }
            return JsonResponse(response_data, status=200)
        except Exception as e:
            print(f"Error: {str(e)}")  # Log the error
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
@csrf_exempt
def save_resume(request):
    if request.method == 'POST':
        try:
            user = request.user  # Assuming user is authenticated
            print(f"User ID: {user.id}")
            print(f"User Information: {user}")
            student = Student.objects.get(user=user)
            print(f"Student ID: {student.id}")
            print(f"Student Information: {student}")

            data = json.loads(request.body)
            skills = data.get('skills', [])
            education_fields = data.get('education_fields', [])
            summary = data.get('summary', '')

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
        except Exception as e:
            print(f"Error: {str(e)}")  # Log the error
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


