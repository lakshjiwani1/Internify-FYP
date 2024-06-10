from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('resume/extract_text_from_pdf/', views.extract_text_from_pdf, name='extract_text_from_pdf'),
    path('resume/extract_text_from_docx/', views.extract_text_from_docx, name='extract_text_from_docx'),
    path('resume/analyze_resume', views.analyze_resume, name='resume_analyze'),
    path('resume/save_resume', views.save_resume, name='save_resume'),
    path('resume/generate_resume', views.generate_resume, name='generate_resume')
]
