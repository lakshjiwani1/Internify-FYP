from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('add_article/', views.add_article, name='add_article'),
    path('view_articles/', views.view_articles, name='view_articles'),
    path('update_article/<int:article_id>/', views.update_article, name='update_article'),
    path('delete_article/<int:article_id>/', views.delete_article, name='delete_article'),
]