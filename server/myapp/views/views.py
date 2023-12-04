# myapp/views.py
import json
import uuid

from datetime import datetime, timedelta
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt

from ..forms import CustomUserCreationForm
from ..models import *
from ..backends import EmailBackend

from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.contrib.auth import login # Import your custom form
from django.db import DatabaseError

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        try:
            data = request.data

            username = data.get('username')
            email = data.get("email")
            password = data.get("password")
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            x= uuid.uuid4()
            print(x)
            form = CustomUserCreationForm({
                'username': username,
                'password': password,
                'email': email,
                'first_name': first_name,
                'last_name': last_name,
                'user_id': x,
            })

            if form.is_valid():
                user = form.save(commit=False)
                user.set_password(password)
                user.save()
                token = RefreshToken.for_user(user)
                return Response({'message': 'User registered and logged in successfully', "access":str(token.access_token)})
            else:
                return Response({'error': 'Invalid form data'}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError:
            return Response({'error': "Duplicate Email/Username already exists"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)

                # Extract email and password from the JSON data
            print(data)
            email = data["email"]
            password = data["password"]
            print(email, password)
            email_backend = EmailBackend()
                # Authenticate the user
            user = email_backend.authenticate(email=email, password=password)
            if user is not None:
                token = RefreshToken.for_user(user)
                return Response({"access": str(token.access_token), "refresh": str(token)})
            else:
                return Response({"error": "Invalid login credentials"})
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        
class LogoutView(APIView):
    permission_classes = [IsAuthenticated,]
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


def create_game_view(request):
    # Create a new game object
    try:
        # Create a new game object
        current_time = datetime.now()

        # Calculate the end time as 60 minutes from the start time
        end_time = current_time + timedelta(minutes=60)

        # Create a new game object with the current time and end time
        new_game = Game(start_time=current_time, end_time=end_time)

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
    
# def get_all_games_for_users(request):
#     try:
#         data = json.loads(request.body)

#         # Extract username, password, and email from the JSON data
#         username = data["username"]
#         games = Game.objects.get(fk = )

#     except:
#         return JsonResponse({'error': 'Game not found'}, status=404)


class ScoreboardView(APIView):
    permission_classes = [AllowAny] # Make authenticated only, but currently not working
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)

                # Extract email and password from the JSON data
            #print(data)
            email = data["email"]
            password = data["password"]
            #print(email, password)
            email_backend = EmailBackend()
                # Authenticate the user
            user = email_backend.authenticate(email=email, password=password)
            if user is not None:
                #token = RefreshToken.for_user(user)
                return Response({"players": ["Test0", "Test1"]})
                # Get game_id by getting player profile from email and password
                #return get_game(0)
            else:
                return Response({"error": "Invalid login credentials"})
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        
def get_game(game_id):
    # Like join_game but with no modifications to the structure
    # Get the game, then access the players, then access the player profiles to get current balances
    try:
        game = Game.objects.get(pk=game_id)

        payload_json = serializers.serialize("json", [game])

        payload_data = json.loads(payload_json)

        return JsonResponse(payload_data)
    except Game.DoesNotExist:
        return JsonResponse({'error': 'Game not found'}, status=404)
    
class CreateGameView(APIView):
    permission_classes = [AllowAny] # Make authenticated only, but currently not working
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)

                # Extract email and password from the JSON data
            #print(data)
            email = data["email"]
            password = data["password"]
            #print(email, password)
            email_backend = EmailBackend()
                # Authenticate the user
            user = email_backend.authenticate(email=email, password=password)
            if user is not None:
                create_game_view()
                print("create_game_view invoked")
            else:
                return Response({"error": "Invalid login credentials"})
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        
class JoinGameView(APIView):
    permission_classes = [AllowAny] # Make authenticated only, but currently not working
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)

                # Extract email and password from the JSON data
            #print(data)
            email = data["email"]
            password = data["password"]
            #print(email, password)
            email_backend = EmailBackend()
                # Authenticate the user
            user = email_backend.authenticate(email=email, password=password)
            if user is not None:
                join_game(game_id=0)
                print("join_game invoked")
            else:
                return Response({"error": "Invalid login credentials"})
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)