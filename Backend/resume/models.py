from django.db import models
from django.conf import settings


class ResumeInfo(models.Model):
    student = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    summary = models.TextField(blank=True, null=True)
    skills = models.TextField(blank=True, null=True)  # Store skills as a comma-separated list
    education = models.TextField(blank=True, null=True)  # Store education fields as a comma-separated list
    parsed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Resume of {self.student.username}"
