from rest_framework import serializers
from .models import Internships

class InternshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Internships
        # fields = '__all__'
        fields = ['accept_applications', 'is_published', 'application_deadline', 'qualifications', 'required_skills', 'location', 'end_date', 'start_date',  'title', 'company']
        read_only_fields = ['company']  # Make company read-only
