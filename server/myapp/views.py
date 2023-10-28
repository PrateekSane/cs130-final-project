# myapp/views.py
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from django.http import JsonResponse

from .forms import CustomUserCreationForm
from .models import *

def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = CustomUserCreationForm()

def create_game_view(request):
    # Create a new game object
    new_game = Game(start_time='2023-10-27 14:00:00', end_time='2023-10-27 16:30:00')

    # Save the game object to the database
    new_game.save()

def join_game(request, game_id):
    try:
        game = Game.objects.get(pk=game_id)
        default_starting_balance = game.starting_balance

        # Create a new player profile with the default starting balance
        player_profile = PlayerProfile(starting_balance=default_starting_balance, current_balance=default_starting_balance)
        player_profile.save()

        # Associate the player profile with the game
        game.player_profiles.add(player_profile)

        return JsonResponse({'message': 'You have successfully joined the game!'})
    except Game.DoesNotExist:
        return JsonResponse({'error': 'Game not found'}, status=404)

