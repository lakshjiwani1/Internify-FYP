from django.shortcuts import render, redirect
from .forms import AddInternshipForm
from .models import Internships, Application
from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .serializers import InternshipSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib import messages
from django.core.serializers import serialize
import json
from .forms import InternshipSearchForm
from authentication.models import CompanyAuth, Student
from resume.models import ResumeInfo
from django.contrib.auth import get_user_model
import jwt
from rest_framework import status
from django.conf import settings
# from serializers import InternshipSerializer
from django.core.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail



def is_company(user):
    return user.is_authenticated and user.user_type == 2


# @user_passes_test(is_company)
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_internship(request):
    try:
        # Get the company associated with the authenticated user
        company = CompanyAuth.objects.get(user=request.user)
        print(company)
        # Create the internship data, but exclude 'company' as it's being added manually
        serializer = InternshipSerializer(data=request.data)

        if serializer.is_valid():
            # Save the internship but assign the company manually
            internship = serializer.save(company=company)
            return Response({"message": "Internship added successfully"}, status=status.HTTP_200_OK)
        else:
            # Raise validation error with the serializer errors
            raise ValidationError(serializer.errors)
    except CompanyAuth.DoesNotExist:
        # Handle case where the user doesn't have a company associated with them
        return Response({"error": "Company not found for the user."}, status=status.HTTP_400_BAD_REQUEST)


# @user_passes_test(is_company)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def internship_list(request):
    form = InternshipSearchForm()
    internships = Internships.objects.filter(company__user = request.user).order_by('-created_at')
    context = {'internships': internships}
    internships_json = serialize('json', internships)
    internships_data = json.loads(internships_json)
    context = {'internships': internships_data}
    
    return JsonResponse(context)
  
@csrf_exempt
def internship_detail(request, pk):
    internship = get_object_or_404(Internships, pk=pk)
    internship_data = {
        'title': internship.title,
        'start_date': internship.start_date,
        'end_date': internship.end_date,
        'location': internship.location,
        'required_skills':internship.required_skills,
        'qualifications': internship.qualifications,
        'application_deadline':internship.application_deadline,
        'is_published': internship.is_published,
        'accept_applications': internship.accept_applications
    }
    print(internship_data)
    return JsonResponse(internship_data)

@csrf_exempt
# @user_passes_test(is_company)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_internship(request, pk):
    message = []
    print(f"Line 104")
    internship = get_object_or_404(Internships, pk=pk)
    print(f"pk: {pk}")
    print(f"internship: {internship}")

    if request.method == 'POST':
        print("Line 108 Update Internship")
        
        # Log the request body
        try:
            body_data = json.loads(request.body)
            # print(f"Received request body: {body_data}")
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
        form = AddInternshipForm(body_data, instance=internship)
        print("Line 110 Update Internship")
        print(f"Form: {form}")

        try:
            form.full_clean()
        except form.ValidationError as e:
            errors = e.message_dict
            return JsonResponse({'errors': errors}, status=400)
        
        try:
            updated_internship = form.save(commit=False)
            updated_internship.save()
            return JsonResponse({'success': True})
        except Exception as e:
            print(f"Error saving internship: {e}")
            return JsonResponse({'success': False})
    else:
        form = AddInternshipForm(instance=internship)

    return render(request, 'internships/create_internship.html', {'form': form, 'message': message})



# @user_passes_test(is_company)
@csrf_exempt
def delete_internship(request, pk):
    internship = get_object_or_404(Internships, pk=pk)

    # Check if the logged-in company owns the internship
    # if internship.company == request.user.companyauth:
    internship_title = internship.title  # Save the title before deletion
    internship.delete()
    return JsonResponse({'success':True})
    # else:
        # Handle the case where the company doesn't own the internship
        # messages.error(request, "You don't have permission to delete this internship.")
        # return JsonResponse({'success':False})
    # return redirect('internship_list')

def view_applications(request, internship_id):
    company = request.user.companyauth
    internship = get_object_or_404(Internships, id=internship_id, company=company)
    applications = Application.objects.filter(internship=internship)
    
    print(f"Company: {company}")
    print(f"Internship: {internship}")
    print(f"Application: {applications}")
    internship_data = {
        'id': internship.id,
        'title': internship.title,
        # 'description': internship.description,

    }
    print("Getting company data")
    company_data = {
        'id': company.id,
        'name': company.name,
    }
    print("Getting application data")
    applications_data = []
    for application in applications:
        student_id = application.student_id
        print(f"Student ID: {student_id}")
        # Fetch the corresponding student entry from the Student table
        student = get_object_or_404(Student, id=student_id)
        user_id = student.user_id
        print(f"User ID: {user_id}")

        # Fetch data from ResumeInfo using user_id
        resume = ResumeInfo.objects.filter(student_id=user_id).first()

        # Serialize resume data
        resume_data = None
        if resume:
            resume_data = {
                'id': resume.id,
                'skills': resume.skills,
                'education': resume.education,
            }

        applications_data.append({
            'id': application.id,
            'student': {
                'id': application.student.id,
                'first_name': application.student.first_name,
                'last_name': application.student.last_name,
                'email': application.student.email,

            },
            'status': application.application_status,
            'applied_at': application.applied_at.strftime('%Y-%m-%d %H:%M:%S'),
            'resume': resume_data
        })

        response_data = {
            'company': company_data,
            'internship': internship_data,
            'application': applications_data
        }

    return JsonResponse({'success':True, 'data':response_data})


def get_company(request):
    if request.method == 'GET':
        companies = CompanyAuth.objects.all()
        company_auth_json = serialize('json', companies)
        company_data = json.loads(company_auth_json)
        return JsonResponse({'companies': company_data})
    
@csrf_exempt
def accept_application(request, application_id):
    company = request.user.companyauth
    application = get_object_or_404(Application, id=application_id)
    internship = application.internship
    student_id = application.student_id
    student = get_object_or_404(Student, id=student_id)
    user_email = student.email
    print(f"application: {application}")
    print(f"student_id: {student_id}")
    print(f"student: {student}")
    print(f"user_email: {user_email}")
    # Update application status
    application.application_status = 'Accepted'
    application.save()
    company_name = company.name
    subject = 'Application Accepted from ' + company_name
    email_body = "Congratulations on your successful application for " + internship.title + " from " + company_name
    try:
        send_mail(subject, email_body, "internify3@gmail.com", [user_email])
        return JsonResponse({'success':True, 'message': 'Email sent successfully'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Error sending email: {str(e)}'}, status=500)

@csrf_exempt
def reject_application(request, application_id):    
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return JsonResponse({'error': 'Authorization header missing or invalid'}, status=401)
    token = auth_header.split(' ')[1]
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_token.get('user_id')
    except jwt.ExpiredSignatureError:
        return JsonResponse({'error': 'Token has expired'}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({'error': 'Invalid token'}, status=401)
    
    # company = request.user.companyauth
    print(f"User ID: {user_id}")
    application = get_object_or_404(Application, id=application_id)
    internship = application.internship
    print(f"Company ID from internship: {internship.company_id}")
    
    if user_id == internship.company_id:
        student_id = application.student_id
        student = get_object_or_404(Student, id=student_id)
        print(f"application: {application}")
        print(f"student_id: {student_id}")
        print(f"student: {student}")
        
        application.application_status = 'Rejected'
        application.save()

        return JsonResponse({'success': True, 'message': "Application rejected successfully"})
    else:
        return JsonResponse({'success':False, 'message': 'This is not your company posted internship.'})
    