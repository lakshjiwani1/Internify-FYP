from socket import gaierror
from django.shortcuts import redirect, render
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import authenticate, login, logout, get_user_model
# from django.contrib.auth.models import User
from django import forms
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib import messages
from django.core.mail import EmailMessage
from .tokens import account_activation_token
from django.utils.encoding import force_bytes, force_str
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import Http404
# Create your views here.


class CustomUserCreationForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, label='First Name', widget=forms.TextInput(attrs={'placeholder': 'First Name', 'autofocus':True}))
    last_name = forms.CharField(max_length=30, label='Last Name', widget=forms.TextInput(attrs={'placeholder': 'Last Name'}))
    email = forms.EmailField(label='Email Address', widget=forms.TextInput(attrs={'placeholder': 'Email Address'}))
    username = forms.CharField(max_length=30, label='Username', widget=forms.TextInput(attrs={'placeholder': 'Username'}))
    
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))
    password2 = forms.CharField(label='Confirm Password', widget=forms.PasswordInput(attrs={'placeholder': 'Confirm Password'}))

    def clean_email(self):
        email = self.cleaned_data['email'].lower()
        User = get_user_model()
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("This email address is already in use.")
        return email

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


def signup(request):
    if request.user.is_authenticated:
        return redirect('/')
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            try:
                user = form.save(commit=False)
                user.is_active = False
                user.email = form.cleaned_data.get('email')
                user.first_name = form.cleaned_data.get('first_name')
                user.last_name = form.cleaned_data.get('last_name')
                user.save()
                error_messages = activate_email(request, user, form.cleaned_data.get('email'))
                if not error_messages:
                    return redirect(signup_success)
                else:
                    user.delete()
                    return render(request, 'authentication/signup.html', {'form': form, 'error_messages': error_messages})
                    # return redirect(signup_success)
                # activate_email(request, user, form.cleaned_data.get('email'))
                # login(request, user)
                # return redirect(signup_success)
                # return render(request, 'authentication/signup.html', {'form': form})
            except (ValidationError, IntegrityError) as e:
                # Handle validation or integrity errors
                messages.error(request, 'Error processing your request. Please try again.')
                
        else:
            messages.error(request, 'Invalid form submission. Please check the form.')
            # print(form.errors)
            return render(request, 'authentication/signup.html', {'form': form})
    else:
        form = CustomUserCreationForm()
        return render(request, 'authentication/signup.html', {'form': form})

def signup_success(request):
    return render(request, 'authentication/signup_success.html')


def home(request):
    return render(request, 'authentication/home.html')

def signin(request):
    if request.user.is_authenticated:
        return render(request, 'authentication/home.html')
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('/profile')
        else:
            msg = 'Invalid Password or Username'
            form = AuthenticationForm(request.POST)
            return render(request, 'authentication/signin.html', {'form': form, 'msg': msg})
    else:
        form = AuthenticationForm()
        return render(request, 'authentication/signin.html', {'form': form})
    

def profile(request):
    return render(request, 'authentication/profile.html')


def signout(request):
    logout(request)
    return redirect('/signin')