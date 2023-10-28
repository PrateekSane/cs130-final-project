# myapp/views.py
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm
from .models import Game

def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = CustomUserCreationForm()
    return render(request, 'registration/register.html', {'form': form})


def create_game_view(request):
    # Create a new game object
    new_game = Game(start_time='2023-10-27 14:00:00', end_time='2023-10-27 16:30:00')

    # Save the game object to the database
    new_game.save()

    return render(request, 'some_template.html')
