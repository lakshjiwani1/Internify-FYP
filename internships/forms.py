from django import forms
from .models import Internships, Application


class AddInternshipForm(forms.ModelForm):
    class Meta:
        model = Internships
        fields = ['title', 'start_date', 'end_date', 'location', 'required_skills', 'qualifications', 'application_deadline', 'is_published', 'accept_applications']
