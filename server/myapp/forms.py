# myapp/forms.py
from django import forms
from .models import CustomUser

class CustomUserCreationForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'first_name', 'last_name')
