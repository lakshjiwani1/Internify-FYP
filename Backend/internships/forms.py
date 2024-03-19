from django import forms
from .models import Internships, Application
import json

class AddInternshipForm(forms.ModelForm):
    def load_json_data(self, json_data):
        data = json.loads(json_data)
        self.data = data
        self.is_bound = True
    
    class Meta:
        model = Internships
        fields = ['title', 'start_date', 'end_date', 'location', 'required_skills', 'qualifications', 'application_deadline', 'is_published', 'accept_applications']
