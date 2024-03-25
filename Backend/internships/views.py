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


def is_company(user):
    return user.is_authenticated and user.user_type == 2


@csrf_exempt
@user_passes_test(is_company)
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
@api_view(['GET'])
def internship_list(request):
    try:
        internships = request.user.companyauth.internships.order_by('-created_at')
        serializer = InternshipSerializer(internships, many=True)  # Serialize queryset
        return JsonResponse(serializer.data)  # Return serialized data as JSON response
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)  # Return error response in case of any exception

def internship_detail(request, pk):
    internship = get_object_or_404(Internships, pk=pk)
    return render(request, 'internships/internship_detail.html', {'internship': internship})


@csrf_exempt
@user_passes_test(is_company)
def update_internship(request, pk):
    message = []
    internship = get_object_or_404(Internships, pk=pk)

    if request.method == 'POST':
        form = AddInternshipForm(request.POST, instance=internship)
        form.load_json_data(request.body)
        try:
            form.full_clean()
        except form.ValidationError as e:
            errors = e.message_dict
            return JsonResponse({'errors':errors}, status=400)
        
        try:
            updated_internship = form.save(commit=False)
            updated_internship.company = request.user.companyauth
            updated_internship.save()
            # message.append("Internship Updated Successfully")
            return JsonResponse({'succeess': True})
        except:
            return JsonResponse({'success': False})
    else:
        form = AddInternshipForm(instance=internship)

    return render(request, 'internships/create_internship.html', {'form': form, 'message': message})



@user_passes_test(is_company)
def delete_internship(request, pk):
    internship = get_object_or_404(Internships, pk=pk)

    # Check if the logged-in company owns the internship
    if internship.company == request.user.companyauth:
        internship_title = internship.title  # Save the title before deletion
        internship.delete()
        return JsonResponse({'success':True})
    else:
        # Handle the case where the company doesn't own the internship
        # messages.error(request, "You don't have permission to delete this internship.")
        return JsonResponse({'success':False})
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

