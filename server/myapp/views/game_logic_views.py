import json
import uuid

from datetime import datetime, timedelta

from ..models import *


from django.http import JsonResponse
from django.core import serializers


from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from backend_api.polygon_api import *

duration_map = {
    "1 hour": timedelta(hours = 1),
    "1 day": timedelta(days = 1),
    "1 week": timedelta(weeks = 1),
    "2 weeks": timedelta(weeks = 2),
    "1 month": timedelta(weeks = 4),
}

class CreateGameView(APIView):
    permission_classes = [IsAuthenticated,]
    def post(self, request):

        try:
            data = request.data
            username = data.get("username")
            duration = data.get("duration")
            starting_balance = data.get("starting_balance", "0")
            if duration == None:
                return JsonResponse({'error': 'Please specify a duration'}, status=404)
            
            if int(starting_balance) < 100:
                return JsonResponse({'error': 'Please specify a starting balance of at least 1000 dollars'}, status=404)

            
            current_time = datetime.now()

         # Calculate the end time as 60 minutes from the start time

            
            end_time = current_time + duration_map[duration]

            # Create a new game object with the current time and end time
            new_game = Game(start_time=current_time, end_time=end_time, starting_balance = starting_balance)
            new_game.save()


            new_portfolio = Portfolio(name=f"{username}'s Portfolio", created_date=current_time)
            new_portfolio.save()


            player_profile = PlayerProfile(
                user=request.user,
                game=new_game,
                starting_balance=new_game.starting_balance,
                current_balance=new_game.starting_balance,
                portfolio = new_portfolio,
            )
            player_profile.save()

            new_game.player_profiles.add(player_profile)

            # Link the Portfolio to the PlayerProfile
            player_profile.portfolio = new_portfolio
            player_profile.save()

            game_json = serializers.serialize("json", [new_game])

            # Parse the serialized JSON
            game_data = json.loads(game_json)[0]

            # Return a success response
            return JsonResponse(game_data)
        except Exception as e:
        # Handle any exceptions or errors
            return JsonResponse({'error': str(e)}, status=500)
        
class JoinGameView(APIView):
    permission_classes = [IsAuthenticated,]

    def post(self, request):
        try:
            data = request.data
            game_id = data.get("game_id")
            username = data.get("username")

            # Fetch the game instance based on the provided ID
            try:
                game_to_join = Game.objects.get(game_id=game_id)
            except Game.DoesNotExist:
                return JsonResponse({'error': 'Game not found'}, status=404)

            current_time = datetime.now()

            # Check if the game is still open for joining
            if current_time > game_to_join.end_time:
                return JsonResponse({'error': 'Game has already ended'}, status=400)

            # Create a new Portfolio for the joining player
            new_portfolio = Portfolio(name=f"{username}'s Portfolio", created_date=current_time)
            new_portfolio.save()

            # Create a PlayerProfile for the joining user
            player_profile = PlayerProfile(
                user=request.user,
                game=game_to_join,
                starting_balance=game_to_join.starting_balance,
                current_balance=game_to_join.starting_balance,
                portfolio=new_portfolio
            )
            player_profile.save()

            # Add the PlayerProfile to the game
            game_to_join.players.add(player_profile)

            return JsonResponse({'message': 'Successfully joined the game', 'game_id': game_to_join.game_id})
        except Exception as e:
            # Handle any exceptions or errors
            return JsonResponse({'error': str(e)}, status=500)
        
class GetGameAndPlayerData(APIView):
    permission_classes = [IsAuthenticated,]
    def post(self, request):
        try:
            data = request.data
            user = request.user
            game_id = data.get("game_id")
            
            game = None
            player_profile = None

            try:
                game = Game.objects.get(game_id = game_id)
            except Game.DoesNotExist:
                return JsonResponse({'error': 'Game not found'}, status=404)
            
            try:
                player_profile = PlayerProfile.objects.get(user=user, game=game)
            except PlayerProfile.DoesNotExist:
                return JsonResponse({'error': 'You\'re not apart of this game'}, status=404)
            
            game_and_player_json = serializers.serialize("json", [game, player_profile])

            game_and_player_data= json.loads(game_and_player_json)
            return JsonResponse(game_and_player_data)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


class UserGamesView(APIView):
    permission_classes = [IsAuthenticated,]

    def get(self, request):
        user = request.user
        try:
            # Retrieve all PlayerProfiles associated with the user
            player_profiles = PlayerProfile.objects.filter(user=user)

            # Extract the games from these profiles
            games = [profile.game for profile in player_profiles]

            # Serialize the game data
            games_data = serializers.serialize('json', games)
            games_data = json.loads(games_data)
            print(games_data)

            # Return the games as a JSON response
            return JsonResponse({'games': games_data})
        except Exception as e:
            # Handle any exceptions
            return JsonResponse({'error': str(e)}, status=500)

class InteractWithHolding(APIView):
    permission_classes = [IsAuthenticated,]

    def post(self, request):
        try:
            data = request.data
            symbol = data.get("symbol")
            game_id = data.get("game_id")
            shares = int(data.get("shares", 0))
            user = request.user
            current_time = datetime.now()

            # Validate the input data
            if not symbol or not game_id or shares <= 0:
                return JsonResponse({'error': 'Invalid input data'}, status=400)

            # Fetch the game instance
            try:
                game = Game.objects.get(game_id=game_id)
            except Game.DoesNotExist:
                return JsonResponse({'error': 'Game not found'}, status=404)

            # Check if the game is still active
            if current_time > game.end_time:
                return JsonResponse({'error': 'Game has already ended'}, status=400)

            # Fetch the player's profile for this game
            try:
                player_profile = PlayerProfile.objects.get(user=user, game=game)
            except PlayerProfile.DoesNotExist:
                return JsonResponse({'error': 'Player profile not found for this game'}, status=404)

            # Instantiate the Yahoo class to get live price
            yahoo_data = Yahoo(tickers=[symbol], interval=60)  # Adjust the interval as needed
            live_price = yahoo_data.fetch_live_price(symbol)

            if live_price is None:
                return JsonResponse({'error': 'Unable to fetch live price for the ticker'}, status=500)

            # Calculate total cost based on live price
            total_cost = shares * live_price

            # Check if the user has enough balance
            if player_profile.current_balance < total_cost:
                return JsonResponse({'error': 'Insufficient balance'}, status=400)

            # Update the balance
            player_profile.current_balance -= total_cost
            player_profile.save()

            # Create and save the holding
            holding = Holding(
                portfolio=player_profile.portfolio,
                stock_symbol=symbol,
                purchase_date=current_time.date(),
                shares=shares,
                purchase_price=live_price
            )
            holding.save()

            return JsonResponse({'message': 'Holding successfully purchased'})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        
    
