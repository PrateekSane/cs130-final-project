from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    # Add custom fields here
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    # Add more fields as needed

    def __str__(self):
        return self.username
    
class Game(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    starting_balance = models.FloatField()

class PlayerProfile(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    starting_balance = models.FloatField()
    current_balance = models.FloatField()
    portfolio = models.OneToOneField('Portfolio', on_delete=models.CASCADE)

class Portfolio(models.Model):
    name = models.CharField(max_length=255)
    created_date = models.DateField()

class Holding(models.Model):
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    stock_symbol = models.CharField(max_length=20)
    purchase_date = models.DateField()
    shares = models.IntegerField()
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)

