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
    path('register/company', views.company_registration, name='company_registration'),
    path('register/success', views.company_reg_success, name='register_success'),
    path('signin/get-csrf-token/', views.get_csrf_token, name='get_csrf_token'),
    # path('signin/company/', views.company_signin, name='company_signin'),
]
