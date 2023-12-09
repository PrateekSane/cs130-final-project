from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class CustomUser(AbstractUser):
    """
    CustomUser model extends the Django AbstractUser model.
    It adds a unique user_id (CharField), phone_number (CharField), and email fields (EmailField).
    """
    # Add custom fields here
    user_id = models.CharField(max_length=50, unique=True, default=uuid.uuid4())
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(unique = True, null = True)
    # Add more fields as needed

    def __str__(self):
        """
        Returns the username (CharField) of the CustomUser.
        """
        return self.username
    
    

class Game(models.Model):
    """
    Game model represents a game session.
    It includes fields for game_id (AutoField), start_time (DateTimeField), join_string (CharField), end_time (DateTimeField), starting_balance (FloatField), and player_profiles (ManyToManyField).
    """
    game_id = models.AutoField(primary_key=True)
    start_time = models.DateTimeField()
    join_string = models.CharField(max_length=50, unique=True, default=uuid.uuid4())
    end_time = models.DateTimeField(null=True, blank=True)
    starting_balance = models.FloatField()

    player_profiles = models.ManyToManyField('PlayerProfile', related_name='games_played')

class PlayerProfile(models.Model):
    """
    PlayerProfile model represents a player's profile in a game. A player has a different profile for each game that they are in. 
    It includes fields for player_profile_id (AutoField), user (ForeignKey), game (ForeignKey), starting_balance (FloatField), current_balance (FloatField), and portfolio (OneToOneField).
    """
    player_profile_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    starting_balance = models.FloatField()
    current_balance = models.FloatField()
    portfolio = models.OneToOneField('Portfolio', on_delete=models.CASCADE)

class Portfolio(models.Model):
    """
    Portfolio model represents a player's portfolio in a game.
    It includes fields for portfolio_id (AutoField), name (CharField), and created_date (DateField).
    """
    portfolio_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    created_date = models.DateField()

class Holding(models.Model):
    """
    Holding model represents a stock holding in a player's portfolio.
    It includes fields for holding_id (AutoField), portfolio (ForeignKey), stock_symbol (CharField), purchase_date (DateField), shares (IntegerField), and purchase_price (DecimalField).
    """
    holding_id = models.AutoField(primary_key=True)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    stock_symbol = models.CharField(max_length=20)
    purchase_date = models.DateField()
    shares = models.IntegerField()
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    

