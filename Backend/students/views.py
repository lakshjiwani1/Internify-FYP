import json
from django.shortcuts import render, get_object_or_404, redirect
from internships.models import Application, Internships
from django.contrib.auth.decorators import user_passes_test
from django.db.models import Q
from .forms import InternshipSearchForm
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.contrib.auth import get_user_model
from authentication.models import Student
from internships.models import Internships
from resume.models import ResumeInfo
from django.db.models import Count
import jwt
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.utils import timezone


# Create your views here.

def is_student(user):
    return user.is_authenticated and user.user_type == 1


# @user_passes_test(is_student)
# def view_all_internships(request):
#     internships = Internships.objects.filter(is_published=True).order_by('-created_at')
#     return render(request, 'students/internship_list.html', {'internships': internships})
    
# @user_passes_test(is_student)
# @csrf_exempt
def view_all_internships(request):
    form = InternshipSearchForm()
    internships = Internships.objects.filter(is_published=True).order_by('-created_at')
    # number_of_applicants = count_applicants(internships)
    context = {'internships': internships}  # Initialize context with an empty list
    print(f"Request_Body: {request.body}")
    print(internships)
    internships_json = serialize('json', internships)
    print(f"Internships Json: {internships_json}")

    internships_data = json.loads(internships_json)
    print(f"Internships data: {internships_data}")

    context = {'internships': internships_data}
    print(f"Context: {context}")
    print(f"Json Response: {JsonResponse(context)}")
    # if request.method == 'GET':
    #     form = InternshipSearchForm(request.GET)
    #     if form.is_valid():
    #         search_by = request.GET.get('search_by', 'company_name')  # Default to searching by company name
    #         query = request.GET.get('query', '')
    #         internships_json = serialize('json', internships)
    #         internships_data = json.loads(internships_json)

    #         # Start with all published internships
    #         internships = Internships.objects.filter(is_published=True).order_by('-created_at')
    #         internships_list = [model_to_dict(internship) for internship in internships]
    #         # Perform the search based on the selected option
    #         if query:
    #             if search_by == 'company_name':
    #                 internships = internships.filter(company__name__icontains=query)
    #             elif search_by == 'internship_name':
    #                 internships = internships.filter(title__icontains=query)

    #         context = {'query': query, 'internships': internships_data}

    # return render(request, 'students/internship_list.html', context)
    return JsonResponse({
        'internships': internships_data,
        # 'number_of_applicants':number_of_applicants
    })


# @user_passes_test(is_student)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_to_internship(request, internship_id):
    messages = []
    internship = get_object_or_404(Internships, pk=internship_id)
    print(f"Application deadline: {internship.application_deadline}")
    # Extract JWT token from Authorization header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return JsonResponse({'error': 'Authorization header missing or invalid'}, status=401)

    token = auth_header.split(' ')[1]

    try:
        # Decode JWT token to get the user info
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_token.get('user_id')
    except jwt.ExpiredSignatureError:
        return JsonResponse({'error': 'Token has expired'}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({'error': 'Invalid token'}, status=401)

    # Fetch the user based on user_id from the token
    User = get_user_model()
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    try:
        resume = ResumeInfo.objects.get(student=user)
    except ResumeInfo.DoesNotExist:
        return JsonResponse({'message': 'Skills and Education data missing. Add data using Resume Builder'}, status=404)
    # Fetch the student associated with the user
    try:
        student = Student.objects.get(user=user)
    except Student.DoesNotExist:
        return JsonResponse({'error': 'Student profile not found'}, status=404)

    if not resume.skills or not resume.education:
        return JsonResponse({'message': 'Skills and Education data missing. Please add data using Resume Builder.'}, status=400)

    if internship.application_deadline < timezone.now().date():
        return JsonResponse({'success': False, 'message': 'The deadline for accepting applications has passed.'}, status=400)

    if internship.accept_applications and internship.is_application_period_active():
        if request.method == 'POST':
            # Check if the student has already applied
            if Application.objects.filter(internship=internship, student=student).exists():
                messages.append('You have already applied to this internship.')
                return render(request, 'students/apply_to_internship.html', {'internship': internship, 'messages': messages})
            else:
                messages.append(f"Applied to {internship.title} internship successfully")
                # Create a new application
                application = Application(internship=internship, student=student)
                application.save()
                return render(request, 'students/apply_success.html', {'internship_title': internship.title, 'messages': messages})
    else:
        messages.append(f"Applications closed for {internship.title}.")

    return render(request, 'students/apply_to_internship.html', {'internship': internship, 'messages': messages})

# def internship_search(request):
#     internships = Internships.objects.filter(is_published=True).order_by('-created_at')
#     search_by = request.GET.get('search_by', 'company_name')  # Default to searching by company name
#     query = request.GET.get('query', '')

#     # Perform the search based on the selected option
#     if search_by == 'company_name':
#         internships = Internships.objects.filter(company__name__icontains=query)
#     elif search_by == 'internship_name':
#         internships = Internships.objects.filter(title__icontains=query)
#     else:
#         # Handle other search options if needed
#         internships = Internships.objects.none()

#     context = {'query': query, 'internships': internships}
#     return render(request, 'internships/internship_list.html', context)


# def internship_search(request):
#     search_by = request.GET.get('search_by', 'company_name')  # Default to searching by company name
#     query = request.GET.get('query', '')

#     # Perform the search based on the selected option
#     if search_by == 'company_name':
#         internships = Internships.objects.filter(company__name__icontains=query)
#     elif search_by == 'internship_name':
#         internships = Internships.objects.filter(title__icontains=query)
#     else:
#         # Handle other search options if needed
#         internships = Internships.objects.none()

#     context = {'query': query, 'internships': internships}
#     return render(request, 'internships/internship_search_results.html', context)
# def count_applicants(request, internships_id):
#     print("starting")
#     internships = get_object_or_404(Internships, pk=internships_id)
#     print(f"internships: {internships}")
#     internships_with_count = []
    
#     for internship in internships:
#         applicant_count = internship.application_set.count()  # Use related manager
#                 # Get student information for each applicant
        
#         applicants = internship.application_set.select_related('student').annotate(
#             student_name=Count('student__first_name'),  # Count for demonstration
#             student_email=Count('student__email'),  # Count for demonstration (replace with actual field)
#         ).values('student__first_name', 'student__email')  # Select specific student fields
#         # Combine internship details, applicant count, and student information
#         internship_data = {
#             'id': internship.id,
#             'title': internship.title,
#             # ... other internship details
#             'applicant_count': applicant_count,
#             'applicants': list(applicants),  # Convert applicants queryset to a list
#         }
#         internships_with_count.append(internship_data)
#     return internships_with_count

def count_applicants(request, internships_id):
    internship = get_object_or_404(Internships, pk=internships_id)

    applicants = []

    for application in internship.application_set.select_related('student').all():
        student = application.student
        resume_info = ResumeInfo.objects.filter(student=student.user_id).first()
        print(f"resume_info: {resume_info}")
        applicant_data = {
            'first_name': student.first_name,
            'last_name':student.last_name,
            'email': student.email,
            'skills': resume_info.skills,
            'education': resume_info.education,
        }
        applicants.append(applicant_data)
    
    internship_data = {
        'id': internship.id,
        'title': internship.title,
        # ... other internship details as needed
        'applicant_count': len(applicants),
        'applicants': list(applicants),
    }

    return JsonResponse(internship_data)

# def track_application(request):
#     auth_header = request.headers.get('Authorization')
#     if not auth_header or not auth_header.startswith('Bearer '):
#         return JsonResponse({'error': 'Authorization header missing or invalid'}, status=401)
#     token = auth_header.split(' ')[1]
#     try:
#         decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
#         user_id = decoded_token.get('user_id')
#     except jwt.ExpiredSignatureError:
#         return JsonResponse({'error': 'Token has expired'}, status=401)
#     except jwt.InvalidTokenError:
#         return JsonResponse({'error': 'Invalid token'}, status=401)
#     print(f"User Id Line 232: {user_id}")
#     User = get_user_model()
#     print("getting user")
#     user = User.objects.get(pk=user_id)
#     print(f"User: {user}")
#     print("Getting student")
#     student = Student.objects.get(user=user)
#     print(f"Student: {student}")

#     # Filter internships where student_id matches the logged-in user's student
#     internships = Internships.objects.filter(application__student=student).distinct()
#     # context = internships
#     internships_json = serialize('json', internships)
#     print(f"Internships Json: {internships_json}")
#     print(f"Internships: {internships}")
#     context = {'internships': internships}
#     internships_data = json.loads(internships_json)
#     print(f"Internships data: {internships_data}")

#     context = {'internships': internships_data}
#     print(f"Context: {context}")

#     return JsonResponse(context)
    # return render(request, 'your_template.html', context)
    # else:
    #     # Redirect to login page if not authenticated
    #     return redirect('login')


def track_application(request):
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
    
    user = get_object_or_404(get_user_model(), pk=user_id)
    student = get_object_or_404(Student, user=user)

    applications = Application.objects.filter(student=student).select_related('internship')
    internships_data = []

    for application in applications:
        internship = application.internship
        internship_data = {
            'id': internship.id,
            'title': internship.title,
            'location': internship.location,
            'start_date': internship.start_date.strftime('%Y-%m-%d'),
            'end_date': internship.end_date.strftime('%Y-%m-%d'),
            'required_skills': internship.required_skills,
            'qualifications': internship.qualifications,
            'application_deadline': internship.application_deadline.strftime('%Y-%m-%d'),
            'status': application.application_status,
}

        internships_data.append(internship_data)

    return JsonResponse({'internships': internships_data})