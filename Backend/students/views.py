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
    number_of_applicants = count_applicants(internships)
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
        'number_of_applicants':number_of_applicants
    })


# @user_passes_test(is_student)
@csrf_exempt
def apply_to_internship(request, internship_id):
    messages = []
    internship = get_object_or_404(Internships, pk=internship_id)
    user_id = 48
    User = get_user_model()
    print("getting user")
    user = User.objects.get(pk=user_id)
    print(f"User: {user}")
    # student = request.user.student
    student = Student.objects.get(user=user)
    print(f"Student: {student}")
    if internship.accept_applications and internship.is_application_period_active():
        if request.method == 'POST':
            # Check if the student has already applied
            if Application.objects.filter(internship=internship, student=student).exists():
                messages.append('You have already applied to this internship.')
                # return render(request, 'student/apply_error.html')
                return render(request, 'students/apply_to_internship.html', {'internship': internship, 'messages': messages})
            else:
                messages.append(f"Applied to {internship.title} internship successfully")
            # Create a new application
            application = Application(internship=internship, student=student, cv_file=student.cv_file)
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
def count_applicants(internships):
    internships_with_count = []
    for internship in internships:
        applicant_count = internship.application_set.count()  # Use related manager
        internship_data = {
            'id': internship.id,
            'title': internship.title,
            # ... other internship details
            'applicant_count': applicant_count
        }
        internships_with_count.append(internship_data)
    return internships_with_count

def track_application(request):
    user_id = 48
    User = get_user_model()
    print("getting user")
    user = User.objects.get(pk=user_id)
    print(f"User: {user}")
    print("Getting student")
    student = Student.objects.get(user=user)
    print(f"Student: {student}")

    # Filter internships where student_id matches the logged-in user's student
    internships = Internships.objects.filter(application__student=student).distinct()
    # context = internships
    internships_json = serialize('json', internships)
    print(f"Internships Json: {internships_json}")
    print(f"Internships: {internships}")
    context = {'internships': internships}
    internships_data = json.loads(internships_json)
    print(f"Internships data: {internships_data}")

    context = {'internships': internships_data}
    print(f"Context: {context}")

    return JsonResponse(context)
    # return render(request, 'your_template.html', context)
    # else:
    #     # Redirect to login page if not authenticated
    #     return redirect('login')