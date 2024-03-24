from django import forms
from .models import Article
import json

class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = ['title', 'content', 'tags']
        
    def load_json_data(self, json_data):
        data = json.loads(json_data)
        self.data = data
        self.is_bound = True

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)