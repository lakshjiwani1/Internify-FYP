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
    return JsonResponse(context)


@user_passes_test(is_student)
def apply_to_internship(request, internship_id):
    messages = []
    internship = get_object_or_404(Internships, pk=internship_id)
    student = request.user.student
    if internship.accept_applications and internship.is_application_period_active():
        if request.method == 'POST':
            # Check if the student has already applied
            if Application.objects.filter(internship=internship, student=request.user.student).exists():
                messages.append('You have already applied to this internship.')
                # return render(request, 'student/apply_error.html')
                return render(request, 'students/apply_to_internship.html', {'internship': internship, 'messages': messages})

            else:
                messages.append(f"Applied to {internship.title} internship successfully")
            
            # Create a new application
            application = Application(internship=internship, student=request.user.student, cv_file=student.cv_file)
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