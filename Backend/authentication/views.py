import json
from socket import gaierror
from django.shortcuts import redirect, render
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.models import User
from django import forms
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
# from django.core.mail import send_mail
from django.template.loader import render_to_string
# from django.utils.html import strip_tags
from django.contrib import messages
from django.core.mail import EmailMessage
from .tokens import account_activation_token
from django.utils.encoding import force_bytes, force_str
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.http import Http404, HttpResponseNotAllowed, JsonResponse, QueryDict
from .forms import CompanyRegistrationForm, CompanySignInForm, StudentUpdateForm
from .models import CompanyAuth, Student, CustomUser
# from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.middleware.csrf import get_token
from django.http import JsonResponse


class CustomUserCreationForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, label='First Name', widget=forms.TextInput(attrs={'placeholder': 'First Name', 'autofocus':True}))
    last_name = forms.CharField(max_length=30, label='Last Name', widget=forms.TextInput(attrs={'placeholder': 'Last Name'}))
    email = forms.EmailField(label='Email Address', widget=forms.TextInput(attrs={'placeholder': 'Email Address'}),
                             error_messages={
                                    'unique': 'This email is already in use. Please choose a different one.',}
                            )
    username = forms.CharField(max_length=30, 
                               label='Username', 
                               widget=forms.TextInput(attrs={'placeholder': 'Username'}),
                               error_messages={
                                    'unique': 'This username is already in use. Please choose a different one.',}
                                )
    
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))
    password2 = forms.CharField(label='Confirm Password', widget=forms.PasswordInput(attrs={'placeholder': 'Confirm Password'}))

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        # username = cleaned_data.get('username')

        if Student.objects.filter(email=email).exists():
            print("email exists")
            raise forms.ValidationError("This email address is already in use.")

        return cleaned_data
    
    def load_json_data(self, json_data):
        data = json.loads(json_data)
        self.data = data
        self.is_bound = True

    def save(self, commit=True):
        user = super().save(commit=False)
        # user.set_unusable_password()
        if commit:
            user.save()
        return user

    class Meta:
        model = get_user_model()
        fields = ['email', 'username', 'password1', 'password2', 'first_name', 'last_name']


def activate(request, uidb64, token):
    # print(f"Raw UID: {uidb64}, Raw Token: {token}")
    User = get_user_model()
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        # print(f"Decoded UID: {uid}")
        user = User.objects.get(pk=uid)

        if not account_activation_token.check_token(user, token):
            raise Http404("Activation link is invalid!")
        
        # Mark the user as active and save
        user.is_active = True
        user.save()
        

        messages.success(request, "Thank you for your email confirmation. Now you can log in to your account.")
        return redirect(signin)

    except User.DoesNotExist:
        raise Http404("User not found!")

    except Exception as e:
        print(f"Exception: {e}")
        # Handle any other exceptions or log them for debugging
        messages.error(request, "Error activating your account.")
        return redirect(home)

def activate_email(request, user, to_email):
    error_messages = []
    subject = 'Verify Your Email'
    message = render_to_string('authentication/verification_email_template.html', {
        'user': user.username,
        'domain': get_current_site(request).domain,
        'uid':urlsafe_base64_encode(force_bytes(user.pk)),
        'token': account_activation_token.make_token(user),
        'protocol': 'https' if request.is_secure() else 'http'
    })
    # encoded_user_id = urlsafe_base64_encode(force_bytes(user.pk))
    # print(f"Encoded UID: {encoded_user_id}")
    # raw_uid = user.pk
    # print(f"Raw UID: {raw_uid}")
    try:
        email = EmailMessage(subject, message, to=[to_email])
        if email.send():
            messages.success(request, f'Dear <b>{user}</b>, please go to your email <b>{to_email}</b> inbox and click on recieved activation link to confirm and complete the registration. <b>Note:</b> Check your spam folder. ')
    except gaierror as e:
        error_messages.append(f'Error sending activation email to {to_email}. Check Internet Connection: {str(e)}')
        # error_messages = [str(error) for error in forms.Form.errors.values()]
        # messages.error(request, f'Problem sending email to {to_email}, check your email address')
        return error_messages

@csrf_exempt
def signup(request):
    if request.user.is_authenticated:
        return redirect('/')

    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        form.load_json_data(request.body)
        try: 
            form.full_clean()
        except forms.ValidationError as e:
            errors = e.message_dict
            return JsonResponse({'errors': errors}, status=400)
        
        print(f"Form Errors: {form.errors}")    
        print(f"Form Cleaned Data: {form.cleaned_data}")
        try:
            with transaction.atomic():
                user = form.save(commit=False)
                user.user_type = 1
                user.is_active = False
                user.save()
                student = Student.objects.create(
                    user=user,
                    first_name=form.cleaned_data['first_name'],
                    last_name=form.cleaned_data['last_name'],
                    email=form.cleaned_data['email'],
                )
            
                error_messages = activate_email(request, user, form.cleaned_data.get('email'))
                # error_messages = None
                if not error_messages:
                    # return redirect(signup_success)
                    response_data = {
                        'id': user.id,
                        'username': user.username,
                        'is_active': user.is_active,
                        'user_type' : user.user_type,
                    }
                    return JsonResponse({'response_data': response_data}, status=201, safe=False)
                else:
                    raise JsonResponse("Error activating email", safe=False)  # Trigger rollback
        except:
            raise JsonResponse('Value already exists', safe=False)

    return JsonResponse({'error': 'Invalid Method'}, status=405)

    #     # if form.is_valid():
    #         # print(form.cleaned_data)
    #     try:
    #         with transaction.atomic():
    #             user = form.save(commit=False)
    #             user.is_active = False
    #             user.user_type = 1  # Assuming 1 is for students
    #             user.save()

    #             student = Student.objects.create(
    #                 user=user,
    #                 first_name=form.cleaned_data.get('first_name'),
    #                 last_name=form.cleaned_data.get('last_name'),
    #                 email=form.cleaned_data.get('email')
    #             )

    #             # error_messages = activate_email(request, user, form.cleaned_data.get('email'))
    #             error_messages = activate_email(request, user, form.cleaned_data.get('email'))

    #             if not error_messages:
    #                 return redirect(signup_success)
    #             else:
    #                 raise ValidationError("Error activating email")  # Trigger rollback

    #     except (ValidationError, IntegrityError):
    #         messages.error(request, 'Error processing your request. Please try again.')

    #     else:
    #         messages.error(request, 'Invalid form submission. Please check the form.')

    # else:
    #     form = CustomUserCreationForm()

    # return render(request, 'authentication/signup.html', {'form': form})


def signup_success(request):
    return render(request, 'authentication/signup_success.html')


def home(request):
    return render(request, 'authentication/home.html')

def get_is_active_status(username):
    User = get_user_model()
    try:
        user = User.objects.get(username=username)
        return user.is_active
    except User.DoesNotExist:
        return None

def get_user_information(username):
    User = get_user_model()
    try:
        user = User.objects.get(username=username)
        user_type = user.user_type
        return user_type
        # print(f"username type: {type(user.username)}")
        # print(f"password type: {type(user.password)}")
    except User.DoesNotExist:
        return None

@csrf_exempt
def signin(request):
    # if request.user.is_authenticated:
    #     return JsonResponse({'success': True, 'redirect': '/'})
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError as e:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'})
        
        if not isinstance(data, dict):
            return JsonResponse({'success': False, 'error': 'Invalid JSON format. Expected a JSON object.'})

        username = data.get('username')
        password = data.get('password')

        print(f"Username: {username}")
        print(f"Password: {password}")

        # print(f"User is_active status: {get_is_active_status(username)}")
        # print(f"Types: {get_user_information(username)}")

        if not (username and password):
            return JsonResponse({'success': False, 'error': 'Username or password is missing'})

        user = authenticate(request, username=username, password=password)
        
        print(f"User: {user}")

        if user is not None:
            login(request, user)
            User = get_user_model()
            try:
                user = User.objects.get(username=username)
                user_type = user.user_type
                print(f"User Type: {user_type}")
                return JsonResponse({'success': True, 'user_type': user_type})
            except User.DoesNotExist:
                return JsonResponse({'success': False, 'error': 'User doesnot exist'})
        else:
            return JsonResponse({'success': False, 'error': 'Invalid username or password'})
    else:
        form = AuthenticationForm()
        return render(request, 'authentication/signin.html', {'form': form})
    

def profile(request):
    user = request.user

    if user.user_type == 1:  # Assuming 1 is the user_type for students
        student = user.student

        if request.method == 'POST':
            form = StudentUpdateForm(request.POST, request.FILES, instance=student)
            if form.is_valid():
                form.save()
                return redirect('profile')  
        else:
            form = StudentUpdateForm(instance=student)

        return render(request, 'authentication/profile.html/', {'form': form, 'student': student})
    
    elif user.user_type == 2:  # Assuming 2 is the user_type for companies
        company = user.companyauth  # Assuming this is how your company is linked to the user

        # if request.method == 'POST':
        #     form = CompanyUpdateForm(request.POST, request.FILES, instance=company)
        #     if form.is_valid():
        #         form.save()
        #         # Redirect or do something else after successful update
        #         return redirect('profile')  # Redirect to the profile page or wherever you want
        # else:
        #     form = CompanyUpdateForm(instance=company)

        return render(request, 'authentication/company_profile.html')
    
    else:
        # Handle other user types or scenarios
        return redirect('home')  # Redirect to the home page


def signout(request):
    logout(request)
    return JsonResponse({'success': True})

@csrf_exempt
def company_registration(request):
    error_messages = []
    if request.user.is_authenticated:
        return redirect('/')
    
    if request.method == 'POST':
        form = CompanyRegistrationForm(request.POST)
        form.load_json_data(request.body)
        
        try:
            form.full_clean()
        except forms.ValidationError as e:
            errors = e.message_dict
            return JsonResponse({'errors': errors}, status=400)
        
        print(f"Form errors: {form.errors}")
        print(f"Form Cleaned Data: {form.cleaned_data}")
        try:
            with transaction.atomic():
                user = form.save(commit=False)
                user.is_active = False
                user.user_type = 2
                # user.email = form.cleaned_data.get('email')
                user.save()

                company = CompanyAuth.objects.create(
                    user=user,
                    name=form.cleaned_data.get('name'),
                    contact_number=form.cleaned_data.get('contact_number'),
                    tax_id=form.cleaned_data.get('tax_id'),
                    address=form.cleaned_data.get('address'),
                    industry_type=form.cleaned_data.get('industry_type'),
                    website_url=form.cleaned_data.get('website_url'),
                    description=form.cleaned_data.get('description'),
                    email = form.cleaned_data.get('email')
                )
                print(type(user.username))
                print(type(user.password))

                return JsonResponse({'success': True}, status=201)
        except ValidationError as e:
            raise JsonResponse('Value already exists')
    else:
        # form = CompanyRegistrationForm()
        return JsonResponse({'error': 'Invalid Method'}, status=405)
    # return render(request, 'authentication/company_registration.html', {'form': form})


def company_reg_success(request):
    return render(request, 'authentication/company_reg_success.html')

# def company_signin(request):
#     error_messages = []
#     if request.method == 'POST':
#         form = CompanySignInForm(request.POST)
#         if form.is_valid():
#             username = form.cleaned_data['username']
#             password = form.cleaned_data['password']
#             print(f"Attempting to authenticate with Email: {email}, Password: {password}")
#             company = authenticate(request, email=email, password=password)
#             print(f"Company status: {company}")
#             if company is not None:
#                 login(request, company)
#                 return redirect("company_dashboard")
#             else:
#                 error_messages.append("Invalid email or password.")
#         else:
#             error_messages.append("Invalid Form Submission")
#     else:
#         form = CompanySignInForm()

#     return render(request, 'authentication/company_signin.html', {'form': form, 'error_messages': error_messages})

def company_dashboard(request):
    return render(request, 'authentication/company_dashboard.html')

@csrf_exempt  # Exempt this view from CSRF protection, as it's providing the token
def get_csrf_token(request):
    csrf_token = get_token(request)  # Get the CSRF token
    print(csrf_token)
    return JsonResponse({'csrf_token': csrf_token})  # Return it as JSON