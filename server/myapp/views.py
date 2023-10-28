# myapp/views.py
import json

from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.core import serializers

from .forms import CustomUserCreationForm
from .models import *

def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
    else:
        form = CustomUserCreationForm()

def create_game_view(request):
    # Create a new game object
    try:
        # Create a new game object
        new_game = Game(start_time='2023-10-27 14:00:00', end_time='2023-10-27 16:30:00')

        # Save the game object to the database
        new_game.save()

        game_json = serializers.serialize("json", [new_game])

        # Parse the serialized JSON
        game_data = json.loads(game_json)[0]

        # Return a success response
        return JsonResponse(game_data)

    except Exception as e:
        # Handle any exceptions or errors
        return JsonResponse({'error': str(e)}, status=500)

    

def join_game(request, game_id):
    try:
        game = Game.objects.get(pk=game_id)
        default_starting_balance = game.starting_balance

        # Create a new player profile with the default starting balance
        player_profile = PlayerProfile(starting_balance=default_starting_balance, current_balance=default_starting_balance)
        player_profile.save()

        payload_json = serializers.serialize("json", [game, player_profile])

        payload_data = json.loads(payload_json)

        # Associate the player profile with the game
        game.player_profiles.add(player_profile)

        return JsonResponse(payload_data)
    except Game.DoesNotExist:
        return JsonResponse({'error': 'Game not found'}, status=404)

