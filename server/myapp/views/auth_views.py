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
        """
        Post request to allow creating a user and adding credentials to the database. 
        
        Parameters
        ----------
        first : request
            Data object. Fields that represent a User's attempt to create an account. 
        Returns
        -------

        Response({'message': 'User registered and logged in successfully', "access":str(token.access_token)})

        Raises
        ------
        HTTP_400_BAD_REQUEST
            Invalid data for form (One example is invalid email ID)
        
        HTTP_500_INTERNAL_SERVER_ERROR
            If the email or username already exists
        """
        try:
            data = request.data

            username = data.get('username')
            email = data.get("email")
            password = data.get("password")
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            x= uuid.uuid4()
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
        """
        Post request to authenticate user log in. 
        
        Parameters
        ----------
        first : request
            Data object. Fields that represent a User's attempt to log in. 
        Returns
        -------

        Response({"access": str(token.access_token), "refresh": str(token)})

        Raises
        ------
        Response({"error": "Invalid login credentials"})
            Invalid login credentials.
        
        JsonResponse({'error': 'Invalid JSON data'}, status=400)
            Json body of request was not properly formatted. 
        """
        try:
            data = json.loads(request.body)

                # Extract email and password from the JSON data
            email = data["email"]
            password = data["password"]
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
        """
        Post request to log out a user.
        
        Parameters
        ----------
        request : Request
            Data object. Fields that represent a User's attempt to log out. 
        
        Returns
        -------
        Response(status=status.HTTP_205_RESET_CONTENT)
            Successful logout.

        Raises
        ------
        Response(status=status.HTTP_400_BAD_REQUEST)
            Failed logout due to an exception.
        """
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
# def get_all_games_for_users(request):
#     try:
#         data = json.loads(request.body)

#         # Extract username, password, and email from the JSON data
#         username = data["username"]
#         games = Game.objects.get(fk = )

#     except:
#         return JsonResponse({'error': 'Game not found'}, status=404)


