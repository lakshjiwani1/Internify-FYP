from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('create_internship/', views.create_internship, name='create_internship'),
    path('internship_list/', views.internship_list, name='internship_list'),
    path('internship_detail/<int:pk>/', views.internship_detail, name='internship_detail'),
    path('update_internship/<int:pk>/', views.update_internship, name='update_internship'),
    path('delete_internship/<int:pk>/', views.delete_internship, name='delete_internship'),
    path('view_applications/<int:internship_id>/', views.view_applications, name='view_applications'),
]