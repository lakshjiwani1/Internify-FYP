from django import forms
from .models import CompanyAuth
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model

class ContactNumberField(forms.CharField):
    def clean(self, value):
        if not all(char.isdigit() or char == '+' for char in value):
            raise forms.ValidationError('Invalid characters in the contact number.')
        return super().clean(value)

class CompanyRegistrationForm(UserCreationForm):
    INDUSTRY_CHOICES = [
        ('Accounting', 'Accounting'),
        ('Administration & Office Support', 'Administration & Office Support'),
        ('Advertising, Arts & Media', 'Advertising, Arts & Media'),
        ('Banking & Financial Services', 'Banking & Financial Services'),
        ('Call Centre & Customer Service', 'Call Centre & Customer Service'),
        ('Community Services & Development', 'Community Services & Development'),
        ('Construction', 'Construction'),
        ('Consulting & Strategy', 'Consulting & Strategy'),
        ('Design & Architecture', 'Design & Architecture'),
        ('Education & Training', 'Education & Training'),
        ('Engineering', 'Engineering'),
        ('Farming, Animals & Conservation', 'Farming, Animals & Conservation'),
        ('Government & Defence', 'Government & Defence'),
        ('Healthcare & Medical', 'Healthcare & Medical'),
        ('Hospitality & Tourism', 'Hospitality & Tourism'),
        ('Human Resources & Recruitment', 'Human Resources & Recruitment'),
        ('Information & Communication Technology', 'Information & Communication Technology'),
        ('Insurance & Superannuation', 'Insurance & Superannuation'),
        ('Legal', 'Legal'),
        ('Manufacturing, Transport & Logistics', 'Manufacturing, Transport & Logistics'),
        ('Marketing & Communications', 'Marketing & Communications'),
        ('Mining, Resources & Energy', 'Mining, Resources & Energy'),
        ('Real Estate & Property', 'Real Estate & Property'),
        ('Retail & Consumer Products', 'Retail & Consumer Products'),
        ('Sales', 'Sales'),
        ('Science & Technology', 'Science & Technology'),
        ('Sport & Recreation', 'Sport & Recreation'),
        ('Trades & Services', 'Trades & Services'),
    ]

    name = forms.CharField(required=True)
    email = forms.EmailField(required=True)
    username = forms.CharField(required=True, max_length=30, label="Username", widget=forms.TextInput(attrs={'placeholder': 'First Name'}))
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))
    password2 = forms.CharField(label='Confirm Password', widget=forms.PasswordInput(attrs={'placeholder': 'Confirm Password'}))
    contact_number = ContactNumberField(max_length=20, required=True)
    tax_id = forms.CharField(required=True)
    address = forms.CharField()
    industry_type = forms.ChoiceField(choices=INDUSTRY_CHOICES, widget=forms.Select(attrs={'class': 'form-control'}))
    website_url = forms.CharField()
    description = forms.CharField()

    def clean_website_url(self):
        website_url = self.cleaned_data['website_url']
        validator = URLValidator()

        try:
            validator(website_url)
        except ValidationError:
            raise forms.ValidationError("Enter a valid URL.")
        
        return website_url
    
    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        # username = cleaned_data.get('username')

        if CompanyAuth.objects.filter(email=email).exists():
            print("email exists")
            raise forms.ValidationError("This email address is already in use.")

        return cleaned_data

    class Meta:
        model = get_user_model()
        fields = ['name', 'email', 'username', 'password1', 'password2', 'contact_number', 'tax_id', 'address', 'industry_type', 'website_url', 'description']
    # def clean_username(self):
    #     username = self.cleaned_data.get('username')
    #     if CompanyAuth.objects.filter(username=username).exists():
    #         raise forms.ValidationError("This username is already in use.")
    #     return username
    

class CompanySignInForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)