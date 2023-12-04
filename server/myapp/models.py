from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class CustomUser(AbstractUser):
    # Add custom fields here
    user_id = models.CharField(max_length=50, unique=True, default=uuid.uuid4())
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(unique = True, null = True)
    # Add more fields as needed

    def __str__(self):
        return self.username
    
    
class Game(models.Model):
    game_id = models.AutoField(primary_key=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    starting_balance = models.FloatField()

    player_profiles = models.ManyToManyField(PlayerProfile, related_name='games_played')

class PlayerProfile(models.Model):
    player_profile_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    starting_balance = models.FloatField()
    current_balance = models.FloatField()
    portfolio = models.OneToOneField('Portfolio', on_delete=models.CASCADE)

class Portfolio(models.Model):
    portfolio_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    created_date = models.DateField()

class Holding(models.Model):
    holding_id = models.AutoField(primary_key=True)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    stock_symbol = models.CharField(max_length=20)
    purchase_date = models.DateField()
    shares = models.IntegerField()
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)

