from rest_framework import serializers
from .models import Student, CompanyAuth

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['first_name', 'last_name', 'email', 'profile_picture', 'cv_file', 'is_active']


class CompanyAuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyAuth
        fields = ['name', 'contact_number', 'tax_id', 'address', 'industry_type', 'website_url', 'description', 'email', 'is_active']
