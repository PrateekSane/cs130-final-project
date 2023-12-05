from django.test import TestCase

from django.contrib.auth import get_user_model
from .models import CustomUser, Game, PlayerProfile, Portfolio, Holding
from datetime import datetime

class ModelTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpassword',
            user_id='test_user_id',
            phone_number='123456789',
            email='testuser@example.com'
        )
        self.game = Game.objects.create(
            start_time=datetime.now(),
            join_string='test_join_string',
            end_time=datetime.now(),
            starting_balance=1000.00
        )
        self.portfolio = Portfolio.objects.create(
            name='test_portfolio',
            created_date=datetime.now().date()
        )

    def test_create_user(self):
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.user_id, 'test_user_id')
        self.assertEqual(self.user.phone_number, '123456789')
        self.assertEqual(self.user.email, 'testuser@example.com')

    def test_create_game(self):
        self.assertEqual(self.game.join_string, 'test_join_string')
        self.assertEqual(self.game.starting_balance, 1000.00)

    def test_create_player_profile(self):
        profile = PlayerProfile.objects.create(
            user=self.user,
            game=self.game,
            starting_balance=500.00,
            current_balance=500.00,
            portfolio=self.portfolio
        )
        self.assertEqual(profile.user, self.user)
        self.assertEqual(profile.game, self.game)
        self.assertEqual(profile.starting_balance, 500.00)
        self.assertEqual(profile.current_balance, 500.00)

    def test_create_portfolio(self):
        self.assertEqual(self.portfolio.name, 'test_portfolio')

    def test_create_holding(self):
        holding = Holding.objects.create(
            portfolio=self.portfolio,
            stock_symbol='AAPL',
            purchase_date=datetime.now().date(),
            shares=10,
            purchase_price=150.00
        )
        self.assertEqual(holding.portfolio, self.portfolio)
        self.assertEqual(holding.stock_symbol, 'AAPL')
        self.assertEqual(holding.shares, 10)
        self.assertEqual(holding.purchase_price, 150.00)
