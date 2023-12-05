import json
import uuid

from datetime import datetime, timedelta
from django.utils import timezone

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

            data = request.data
            username = data.get("username")
            duration = data.get("duration")
            starting_balance = data.get("starting_balance", "0")
            if duration == None:
                return JsonResponse({'error': 'Please specify a duration'}, status=404)
            
            if int(starting_balance) < 100:
                return JsonResponse({'error': 'Please specify a starting balance of at least 1000 dollars'}, status=404)

            
            current_time = timezone.now()

         # Calculate the end time as 60 minutes from the start time

            print(duration)
            end_time = current_time + duration_map[duration]

            # Create a new game object with the current time and end time
            new_game = Game(join_string = uuid.uuid4(), start_time=current_time, end_time=end_time, starting_balance = starting_balance)
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
            user_id = request.user.id
            if PlayerProfile.objects.filter(game=game_to_join, user_id=user_id).exists():
                return JsonResponse({'error': 'User is already part of this game'}, status=400)
            current_time = timezone.now()

            # Check if the game is still open for joining
            if current_time > game_to_join.end_time:
                return JsonResponse({'error': 'Game has already ended'}, status=400)

            # Create a new Portfolio for the joining player
            new_portfolio = Portfolio(name=f"{username}'s Portfolio", created_date=current_time)
            new_portfolio.save()

            # Create a PlayerProfile for the joining use
            player_profile = PlayerProfile(
                user=request.user,
                game=game_to_join,
                starting_balance=game_to_join.starting_balance,
                current_balance=game_to_join.starting_balance,
                portfolio=new_portfolio
            )
            player_profile.save()

            # Add the PlayerProfile to the game
            game_to_join.player_profiles.add(player_profile)

            return JsonResponse({'message': 'Successfully joined the game', 'game_id': game_to_join.game_id})
        except Exception as e:
            # Handle any exceptions or errors
            print(e)
            return JsonResponse({'error': str(e)}, status=500)
        
class GetGameAndPlayerData(APIView):
    permission_classes = [IsAuthenticated,]

    def post(self, request):
        user = request.user
        game_id = request.data.get("game_id")

        try:
            # Retrieve game, player profile, and holdings
            
            game = Game.objects.get(game_id=game_id)

            print(user, game)
            player_profile = PlayerProfile.objects.get(user=user, game=game)
            portfolio = player_profile.portfolio
            holdings = Holding.objects.filter(portfolio=portfolio)

            # Serialize data
            serialized_data = serializers.serialize("json", [game, player_profile, portfolio] + list(holdings))

        except Exception as e:
            # General exception for unexpected errors
            print(e)
            return JsonResponse({'error': str(e)}, status=500)

        # Parse serialized data and return response
        game_and_player_data = json.loads(serialized_data)
        return JsonResponse({"game_and_player_data": game_and_player_data})


class UserGamesView(APIView):
    permission_classes = [IsAuthenticated,]

    def get(self, request):
        user = request.user
        #try:
            # Retrieve all PlayerProfiles associated with the user

        player_profiles = PlayerProfile.objects.filter(user=user)

        # Extract the games from these profiles
        games = [profile.game for profile in player_profiles]
        # Serialize the game data
        games_data = serializers.serialize('json', games)
        games_data = json.loads(games_data)


        formatted_games = []
        for game in games_data:
            game_info = game['fields'].copy()
            game_info['game_id'] = game['pk']
            formatted_games.append(game_info)

        # Return the games as a JSON response
        return JsonResponse({'games': formatted_games})
        # except Exception as e:
        #     # Handle any exceptions
        #     return JsonResponse({'error': str(e)}, status=500)

class InteractWithHolding(APIView):
    permission_classes = [IsAuthenticated,]

    def post(self, request):
    
            data = request.data
            symbol = data.get("symbol")
            game_id = int(data.get("game_id"))
            shares = int(data.get("shares", 0))
            user = request.user
            current_time = datetime.now()
            user = CustomUser.objects.get(username=user)
            # Validate the input data
            if not symbol or not game_id:
                return JsonResponse({'error': 'Invalid input data'}, status=400)
            # Fetch the game instance
            
            game = Game.objects.get(game_id=game_id)
            # Check if the game is still active
            # if current_time > game.end_time:
            #     return JsonResponse({'error': 'Game has already ended'}, status=400)

            # Fetch the player's profile for this game
            player_profile = PlayerProfile.objects.get(user=user, game=game)

            # Instantiate the Yahoo class to get live price
            yahoo_data = Yahoo(tickers=[symbol], interval=60)  # Adjust the interval as needed
            live_price = yahoo_data.fetch_live_ticker(symbol)
        
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

        # except Exception as e:
        #     print(e)
        #     return JsonResponse({'error': str(e)}, status=500)

        
    
class PlayGameView(APIView):
    permission_classes = [IsAuthenticated,]

    def get(self, request):
        user = request.user
        #try:
            # Retrieve all PlayerProfiles associated with the user

        player_profiles = PlayerProfile.objects.filter(user=user)

        # Extract the games from these profiles
        games = [profile.game for profile in player_profiles]
        # Serialize the game data
        games_data = serializers.serialize('json', games)
        games_data = json.loads(games_data)
        print("hello", games_data)
        formatted_games = []
        for game in games_data:
            game_info = game['fields'].copy()
            game_info['game_id'] = game['pk']
            formatted_games.append(game_info)

        # Return the games as a JSON response
        return JsonResponse({'games': formatted_games})
        # except Exception as e:
        #     # Handle any exceptions
        #     return JsonResponse({'error': str(e)}, status=500)


class GetScoreboard(APIView):
    permission_classes = [IsAuthenticated,]

    def post(self, request):
        game_id = request.data.get("game_id")
        # Retrieve all PlayerProfiles associated with the game_id and sort by current balance
        player_profiles = PlayerProfile.objects.filter(game_id=game_id).order_by('-current_balance')
        profiles_data = serializers.serialize('json', player_profiles)
        profiles_data = json.loads(profiles_data)
        print(profiles_data)
        for profile in profiles_data:
            user_id = profile['fields']['user']  # Assuming 'user' field holds the user ID
            user = CustomUser.objects.get(id=user_id)  # Assuming User model is used for user data
            profile['fields']['username'] = user.username  # Add username to the profile data
        print(profiles_data)
        return JsonResponse({"scoreboard_profiles": profiles_data})
