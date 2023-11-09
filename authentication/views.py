from django.shortcuts import redirect, render
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django import forms
# Create your views here.


class CustomUserCreationForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, label='First Name', widget=forms.TextInput(attrs={'placeholder': 'First Name'}))
    last_name = forms.CharField(max_length=30, label='Last Name', widget=forms.TextInput(attrs={'placeholder': 'Last Name'}))
    email = forms.EmailField(label='Email Address', widget=forms.TextInput(attrs={'placeholder': 'Email Address'}))
    username = forms.CharField(max_length=30, label='Username', widget=forms.TextInput(attrs={'placeholder': 'Username'}))
    
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))
    password2 = forms.CharField(label='Confirm Password', widget=forms.PasswordInput(attrs={'placeholder': 'Confirm Password'}))


def signup(request):
    if request.user.is_authenticated:
        return redirect('/')
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            # username = form.cleaned_data.get('username')
            # password = form.cleaned_data.get('password1')
            # user = authenticate(username=username, password=password)
            user.email = form.cleaned_data.get('email')
            # user.date_of_birth = form.cleaned_data.get('date_of_birth')
            user.first_name = form.cleaned_data.get('first_name')
            user.last_name = form.cleaned_data.get('last_name')
            user.save()
            
            login(request, user)
            return redirect('/profile')
        else:
            # print(form.errors)
            return render(request, 'authentication/signup.html', {'form': form})
    else:
        form = CustomUserCreationForm()
        return render(request, 'authentication/signup.html', {'form': form})


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