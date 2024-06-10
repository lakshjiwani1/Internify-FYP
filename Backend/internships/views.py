from django.shortcuts import render, redirect
from .forms import AddInternshipForm
from .models import Internships, Application
from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .serializers import InternshipSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib import messages
from django.core.serializers import serialize
import json
from .forms import InternshipSearchForm


def is_company(user):
    return user.is_authenticated and user.user_type == 2


# @csrf_exempt
# @user_passes_test(is_company)
@csrf_exempt
def create_internship(request):
    message = []                                

    if request.method == 'POST':
        form = AddInternshipForm(request.POST)
        form.load_json_data(request.body)
        try:
            form.full_clean()
        except form.ValidationError as e:
            errors = e.message_dict
            return JsonResponse({'errors':errors}, status=400)
        
        print(f"Form Cleaned Data: {form.cleaned_data}")

        try:
            internship = form.save(commit=False)
            internship.company = request.user.companyauth
            if internship.company:
                internship.save()
                return JsonResponse({'success': True, 'redirect': '/'})
            else:
                return JsonResponse({'success': False, "message":"Company Not Set"})
        except:
            return JsonResponse({'success': False, "message":"Form is not valid"})
    else:
        form = AddInternshipForm()

    return render(request, 'internships/create_internship.html', {'form': form, 'message': message})


# @user_passes_test(is_company)
# @api_view(['GET'])
def internship_list(request):
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
  
@csrf_exempt
def internship_detail(request, pk):
    internship = get_object_or_404(Internships, pk=pk)
    internship_data = {
        'title': internship.title,
        'start_date': internship.start_date,
        'end_date': internship.end_date,
        'location': internship.location,
        'required_skills':internship.required_skills,
        'qualification': internship.qualifications,
        'application_deadline':internship.application_deadline,
        'is_published': internship.is_published,
        'accept_application': internship.accept_applications
    }
    print(internship_data)
    # internships_json = serialize('json', internship)
    # internships_data = json.loads(internships_json)
    # context = {'internships': internships_data}
    # return JsonResponse(context)
    return JsonResponse(internship_data)
    # return JsonResponse(internship_data)

@csrf_exempt
# @user_passes_test(is_company)

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
            print(f"Received request body: {body_data}")
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
    # Get the company of the logged-in user
    company = request.user.companyauth

    # Get the specific internship for the company
    internship = get_object_or_404(Internships, id=internship_id, company=company)

    # Get all applications for the specific internship
    applications = Application.objects.filter(internship=internship)

    context = {'internship': internship, 'applications': applications}
    return render(request, 'internships/view_applications.html', context)

