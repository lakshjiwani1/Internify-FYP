from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('signup/', views.signup, name='signup'),
    path('signin/', views.signin, name='signin'),
    path('profile/', views.profile, name = 'profile'),
    path('signup/success/', views.signup_success, name='signup_success'),
    path('activate/<uidb64>/<token>', views.activate, name='activate'),
    path('signout/', views.signout, name='signout'),
]
