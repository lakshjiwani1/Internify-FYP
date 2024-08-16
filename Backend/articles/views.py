from django.shortcuts import render
from .forms import ArticleForm
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from .serializers import ArticleSerializer
from rest_framework.response import Response
from .models import Article
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError
from .serializers import ArticleSerializer
from rest_framework import status




# Create your views here.
# @csrf_exempt
# @login_required
# @csrf_protect
# @ensure_csrf_cookie
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_article(request):
    # Create serializer instance with the request data
    serializer = ArticleSerializer(data=request.data)
    
    # Validate the serializer
    if serializer.is_valid():
        # Save the validated data
        serializer.save()
        return Response({"message": "Article added successfully"}, status=status.HTTP_200_OK)
    else:
        # Raise a ValidationError with serializer errors
        raise ValidationError(serializer.errors)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_articles(request):
    # Get the ID of the logged-in user
    user_id = request.user.id

    # Filter articles by the logged-in user's ID
    articles = Article.objects.filter(author__id=user_id).values()

    # Return a Response object with the article data
    return Response({'articles': list(articles)})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_all_articles(request):
    articles = Article.objects.filter().values()
    return Response({'articles': list(articles)})


@csrf_exempt
def update_article(request, article_id):
    # Retrieve the article from the database or return a 404 error if not found
    article = get_object_or_404(Article, id=article_id)
    
    # Check if the currently signed-in user is the author of the article
    # if request.user == article.author:
        # User is the author, allow them to edit the article
    if request.method == 'POST':
        form = ArticleForm(request.POST, instance=article)
        form.load_json_data(request.body)
        if form.is_valid():
            article.last_edited = timezone.now()
            form.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'errors': form.errors}, status=400)
    else:
        form = ArticleForm(instance=article)
        return render(request, 'internships/update_article.html', {'form': form})
    # else:
    #     # User is not authorized to edit the article
    #     return JsonResponse({'success': False, 'message': 'You are not authorized to edit this article.'}, status=403)
    
    
@csrf_exempt
def delete_article(request, article_id):
    # Get the article object or return 404 if not found
    article = get_object_or_404(Article, pk=article_id)
    
    # Check if the user is the author of the article
    # if request.user == article.author:
        # Delete the article
    article.delete()
    return JsonResponse({'success': True})
    # else:
    #     return JsonResponse({'success': False, 'message': 'You are not authorized to delete this article.'}, status=403)