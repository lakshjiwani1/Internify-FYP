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
from authentication.models import CompanyAuth
from django.contrib.auth import get_user_model
import jwt
from rest_framework import status
from django.conf import settings
# from serializers import InternshipSerializer
from django.core.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated



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
        'qualification': internship.qualifications,
        'application_deadline':internship.application_deadline,
        'is_published': internship.is_published,
        'accept_application': internship.accept_applications
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
    # Get the company of the logged-in user
    company = request.user.companyauth

    # Get the specific internship for the company
    internship = get_object_or_404(Internships, id=internship_id, company=company)

    # Get all applications for the specific internship
    applications = Application.objects.filter(internship=internship)

    context = {'internship': internship, 'applications': applications}
    return render(request, 'internships/view_applications.html', context)


def get_company(request):
    if request.method == 'GET':
        companies = CompanyAuth.objects.all()
        company_auth_json = serialize('json', companies)
        company_data = json.loads(company_auth_json)
        return JsonResponse({'companies': company_data})
