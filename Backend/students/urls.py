from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('view_all_internships/', views.view_all_internships, name='view_all_internships'),
    path('apply_to_internship/<int:internship_id>/', views.apply_to_internship, name='apply_to_internship'),
    path('track_application/', views.track_application, name='track_application')
    # path('search_internship/', views.internship_search, name='internship_search'),
]