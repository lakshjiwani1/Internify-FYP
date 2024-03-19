from rest_framework import serializers
from .models import Internships

class InternshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Internships
        fields = '__all__'
