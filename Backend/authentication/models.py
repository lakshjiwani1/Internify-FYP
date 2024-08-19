from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from django.conf import settings
import os


# Create your models here.


class Student(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    profile_picture = models.ImageField(upload_to='student_profile_pics/', null=True, blank=True)
    cv_file = models.FileField(upload_to='student_cvs/', null=True, blank=True)
    is_active = models.BooleanField(default=False)
    

    def __str__(self):
        return self.user.username
    
    # def save(self, *args, **kwargs):
    #     # Auto rename profile picture
    #     if self.profile_picture:
    #         self.profile_picture.name = self.generate_filename('profile_picture', self.profile_picture.name)

    #     # Auto rename CV file
    #     if self.cv_file:
    #         self.cv_file.name = self.generate_filename('cv_file', self.cv_file.name)

    #     super().save(*args, **kwargs)

    # def generate_filename(self, field_name, original_filename):
    #     username = self.user.username
    #     count = Student.objects.filter(user=self.user).count() + 1
    #     base, ext = os.path.splitext(original_filename)
    #     return f'{username}_{field_name}_{count}{ext}'



class CompanyAuth(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, null=False)
    contact_number = models.CharField(max_length=20, null=False)
    tax_id = models.CharField(max_length=255, null=False)
    address = models.CharField(max_length=255)
    industry_type = models.CharField(max_length=255)
    website_url = models.CharField(max_length=255)
    description = models.TextField(default="description")
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
    

class CustomUserManager(BaseUserManager):
    def create_user(self, username, user_type, password=None, **extra_fields):
        if not username:
            raise ValueError("The username field must be set")
        
        user = self.model(username=username, user_type=user_type, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, user_type, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        # extra_fields.setdefault('user_type', 3)
        return self.create_user(username, user_type, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    USER_TYPE_CHOICES = (
        (1, 'Student'),
        (2, 'Company'),
        (3, 'admin'),
    )

    id = models.AutoField(primary_key=True)
    last_login = models.DateTimeField(default=timezone.now)
    date_joined = models.DateTimeField(default=timezone.now)
    username = models.CharField(max_length=30, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    user_type = models.IntegerField(choices=USER_TYPE_CHOICES)
    
    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['user_type']

    def __str__(self):
        return self.username