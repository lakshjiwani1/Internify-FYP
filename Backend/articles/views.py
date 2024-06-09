from django.shortcuts import render
from .forms import ArticleForm
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from .serializers import ArticleSerializer
from rest_framework.response import Response
from .models import Article
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect


# Create your views here.
# @csrf_protect
# @login_required
@csrf_exempt
def add_article(request):
    if request.method == 'POST':
        form = ArticleForm(request.POST)
        form.load_json_data(request.body)
        try:
            form.full_clean()
        except form.ValidationError as e:
            errors = e.message_dict
            return JsonResponse({'errors': errors}, status=400)

        try:
            print(f"User: {request.user}")
            article = form.save(commit=False)
            article.author = request.user
            article.save()
            return JsonResponse({'success': True})
        except AttributeError as e:
            return JsonResponse({'success': False, 'message': str(e)})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    else:
        form = ArticleForm()
        return render(request, 'internships/create_internship.html', {'form': form})

# @api_view(['GET'])
def view_articles(request):
    articles = Article.objects.all().values()  # Retrieve all articles as dictionaries
    return JsonResponse({'articles': list(articles)})

@csrf_exempt
def update_article(request, article_id):
    # Retrieve the article from the database or return a 404 error if not found
    article = get_object_or_404(Article, id=article_id)
    
    # Check if the currently signed-in user is the author of the article
    if request.user == article.author:
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
    else:
        # User is not authorized to edit the article
        return JsonResponse({'success': False, 'message': 'You are not authorized to edit this article.'}, status=403)
    
    
def delete_article(request, article_id):
    # Get the article object or return 404 if not found
    article = get_object_or_404(Article, pk=article_id)
    
    # Check if the user is the author of the article
    if request.user == article.author:
        # Delete the article
        article.delete()
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False, 'message': 'You are not authorized to delete this article.'}, status=403)
    