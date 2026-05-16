from django.urls import path
from ..service.oath import GetAllUsersService, LoginService, GetProfileService ,CreateUserService,LogoutService

urlpatterns = [

    # Login
    path('login/',LoginService, name='login'),

    # Get Logged User
    path('profile/', GetProfileService,name='profile'),
       # Create User
    path('create-user/', CreateUserService),
    # logout
    path('logout/', LogoutService),

    # all user list
    path('get-users/', GetAllUsersService, name='get-users' ),
]