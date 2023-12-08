from django import forms

class InternshipSearchForm(forms.Form):
    search_by = forms.ChoiceField(choices=[('company_name', 'Company Name'), ('internship_name', 'Internship Name')])
    query = forms.CharField()
    
