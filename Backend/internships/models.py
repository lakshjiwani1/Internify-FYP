from django.db import models
from authentication.models import CompanyAuth, Student
from django.utils import timezone


# Create your models here.

class Internships(models.Model):
    company = models.ForeignKey(CompanyAuth, on_delete=models.CASCADE, related_name='internships')
    title = models.CharField(max_length=255, null=False)
    start_date = models.DateField()
    end_date = models.DateField()
    location = models.CharField(max_length=255)
    required_skills = models.TextField()
    qualifications = models.TextField()
    application_deadline = models.DateField()
    is_published = models.BooleanField(default=True)
    accept_applications = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    applied_students = models.ManyToManyField(Student, through='Application')

    def is_application_period_active(self):
        """
        Check if the current date is before or equal to the last_date.
        """
        return timezone.now().date() <= self.end_date

class Application(models.Model):
    internship = models.ForeignKey(Internships, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    # cv_file = models.FileField(upload_to='student_cvs/')
    application_status = models.CharField(max_length=20, default='Pending')
    applied_at = models.DateTimeField(auto_now_add=True)