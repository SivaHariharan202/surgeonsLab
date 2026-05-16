from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from ..utils.jwt_auth import get_logged_user
from ..model.model import TaskAppUser
from ..serializers import LoginSerializer,TaskAppUserSerializer
from ..utils.api_response import (
    api_response,
    ApiResponseStatus,
    ErrorMessageType
)
# from rest_framework.permissions import (
#     IsAuthenticated
# )

# --------------------------------
# JWT Login API
# --------------------------------

# is not give a any default value like admin
# @api_view(['POST'])
# def LoginService(request):
#     try:

#         serializer = LoginSerializer(data=request.data)

#         if serializer.is_valid():

#             email = serializer.validated_data.get('email')
#             password = serializer.validated_data.get('password')

#             try:
#                 user = TaskAppUser.objects.get(email=email)

#             except TaskAppUser.DoesNotExist:
#                 return Response(api_response(
#                     status=ApiResponseStatus.ERROR,
#                     error={
#                         "type": ErrorMessageType.ERROR,
#                         "message": "Invalid Email"
#                     }
#                 ))

#             if not check_password(password, user.password):
#                 return Response(api_response(
#                     status=ApiResponseStatus.ERROR,
#                     error={
#                         "type": ErrorMessageType.ERROR,
#                         "message": "Invalid Password"
#                     }
#                 ))

#             if not user.is_active:
#                 return Response(api_response(
#                     status=ApiResponseStatus.ERROR,
#                     error={
#                         "type": ErrorMessageType.ERROR,
#                         "message": "User is inactive"
#                     }
#                 ))

#             # Create JWT token manually
#             refresh = RefreshToken()

#             refresh['user_id'] = user.id
#             refresh['role'] = user.role
#             refresh['email'] = user.email

#             response_data = {
#                 "id": user.id,
#                 "full_name": user.full_name,
#                 "email": user.email,
#                 "role": user.role,
#                 "access_token": str(refresh.access_token),
#                 "refresh_token": str(refresh)
#             }

#             return Response(api_response(
#                 status=ApiResponseStatus.SUCCESS,
#                 data=response_data
#             ))

#         return Response(api_response(
#             status=ApiResponseStatus.ERROR,
#             error={
#                 "type": ErrorMessageType.ERROR,
#                 "message": serializer.errors
#             }
#         ))

#     except Exception as e:
#         return Response(api_response(
#             status=ApiResponseStatus.ERROR,
#             error={
#                 "type": ErrorMessageType.ERROR,
#                 "message": str(e)
#             }
#         ))

# i give a default value for only one admin
@api_view(['POST'])
def LoginService(request):
    try:

        # Auto create static admin
        admin_email = "admin@gmail.com"

        admin_exists = TaskAppUser.objects.filter(
            email=admin_email
        ).exists()

        if not admin_exists:
            TaskAppUser.objects.create(
                full_name="Admin",
                email="admin@gmail.com",
                password="admin123",
                role="admin",
                is_active=True
            )

        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():

            email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')

            try:
                user = TaskAppUser.objects.get(
                    email=email
                )

            except TaskAppUser.DoesNotExist:
                return Response(api_response(
                    status=ApiResponseStatus.ERROR,
                    error={
                        "type": ErrorMessageType.ERROR,
                        "message": "Invalid Email"
                    }
                ))

            if not check_password(
                password,
                user.password
            ):
                return Response(api_response(
                    status=ApiResponseStatus.ERROR,
                    error={
                        "type": ErrorMessageType.ERROR,
                        "message": "Invalid Password"
                    }
                ))

            if not user.is_active:
                return Response(api_response(
                    status=ApiResponseStatus.ERROR,
                    error={
                        "type": ErrorMessageType.ERROR,
                        "message": "User is inactive"
                    }
                ))

            # JWT Token
            refresh = RefreshToken()

            refresh['user_id'] = user.id
            refresh['role'] = user.role
            refresh['email'] = user.email

            response_data = {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role,
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh)
            }

            return Response(api_response(
                status=ApiResponseStatus.SUCCESS,
                data=response_data
            ))

        return Response(api_response(
            status=ApiResponseStatus.ERROR,
            error={
                "type": ErrorMessageType.ERROR,
                "message": serializer.errors
            }
        ))

    except Exception as e:
        return Response(api_response(
            status=ApiResponseStatus.ERROR,
            error={
                "type": ErrorMessageType.ERROR,
                "message": str(e)
            }
        ))

# --------------------------------
# Get Logged In User Details
# JWT Protected API
# --------------------------------


@api_view(['GET'])
def GetProfileService(request):
    try:

        auth_user = request.user

        user = TaskAppUser.objects.get(id=auth_user.id)

        response_data = {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active
        }

        return Response(api_response(
            status=ApiResponseStatus.SUCCESS,
            data=response_data
        ))

    except Exception as e:
        return Response(api_response(
            status=ApiResponseStatus.ERROR,
            error={
                "type": ErrorMessageType.EXCEPTION,
                "message": str(e)
            }
        ))
    



# --------------------------------
# Create User API (Admin Only)
# --------------------------------
@api_view(['POST'])
def CreateUserService(request):
    try:

        logged_user = get_logged_user(request)

        if not logged_user:
            return Response(api_response(
                status=ApiResponseStatus.ERROR,
                error={
                    "type": ErrorMessageType.ERROR,
                    "message": "Unauthorized User"
                }
            ))

        # Admin Check
        if logged_user.role != 'admin':
            return Response(api_response(
                status=ApiResponseStatus.ERROR,
                error={
                    "type": ErrorMessageType.ERROR,
                    "message": "Only admin can create users"
                }
            ))

        serializer = TaskAppUserSerializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(api_response(
                status=ApiResponseStatus.SUCCESS,
                data=serializer.data
            ))

        return Response(api_response(
            status=ApiResponseStatus.ERROR,
            error={
                "type": ErrorMessageType.ERROR,
                "message": serializer.errors
            }
        ))

    except Exception as e:
        return Response(api_response(
            status=ApiResponseStatus.ERROR,
            error={
                "type": ErrorMessageType.ERROR,
                "message": str(e)
            }
        ))
    



@api_view(['POST'])
def LogoutService(request):
    try:

        refresh_token = request.data.get('refresh_token')

        if not refresh_token:
            return Response(api_response(
                status=ApiResponseStatus.ERROR,
                error={
                    "type": ErrorMessageType.ERROR,
                    "message": "Refresh token is required"
                }
            ))

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(api_response(
                status=ApiResponseStatus.SUCCESS,
                data={
                    "message": "Logout successful"
                }
            ))

        except Exception:
            return Response(api_response(
                status=ApiResponseStatus.ERROR,
                error={
                    "type": ErrorMessageType.ERROR,
                    "message": "Invalid token"
                }
            ))

    except Exception as e:
        return Response(api_response(
            status=ApiResponseStatus.ERROR,
            error={
                "type": ErrorMessageType.EXCEPTION,
                "message": str(e)
            }
        ))
    


# @api_view(['GET'])
# def GetAllUsersService(request):
#     try:

#         logged_user = get_logged_user(request)

#         if not logged_user:
#             return Response(api_response(
#                 status=ApiResponseStatus.ERROR,
#                 error={
#                     "type": ErrorMessageType.ERROR,
#                     "message": "Unauthorized User"
#                 }
#             ))

#         # Only admin can access
#         if logged_user.role != "admin":
#             return Response(api_response(
#                 status=ApiResponseStatus.ERROR,
#                 error={
#                     "type": ErrorMessageType.ERROR,
#                     "message": "Access Denied"
#                 }
#             ))

#         users = TaskAppUser.objects.filter(
#             role="user",
#             is_active=True
#         ).values(
#             "id",
#             "full_name",
#             "email",
#             "role"
#         ).order_by("-id")

#         return Response(api_response(
#             status=ApiResponseStatus.SUCCESS,
#             data=list(users)
#         ))

#     except Exception as e:
#         return Response(api_response(
#             status=ApiResponseStatus.ERROR,
#             error={
#                 "type": ErrorMessageType.ERROR,
#                 "message": str(e)
#             }
#         ))
    


@api_view(['GET'])
def GetAllUsersService(request):
    try:

        logged_user = get_logged_user(request)

        if not logged_user:
            return Response(api_response(
                status=ApiResponseStatus.ERROR,
                error={
                    "type": ErrorMessageType.ERROR,
                    "message": "Unauthorized User"
                }
            ))

        # Only admin can access
        if logged_user.role != "admin":
            return Response(api_response(
                status=ApiResponseStatus.ERROR,
                error={
                    "type": ErrorMessageType.ERROR,
                    "message": "Access Denied"
                }
            ))

        users = TaskAppUser.objects.filter(
            is_active=True
        ).values(
            "id",
            "full_name",
            "email",
            "role"
        ).order_by("-id")

        return Response(api_response(
            status=ApiResponseStatus.SUCCESS,
            data=list(users)
        ))

    except Exception as e:
        return Response(api_response(
            status=ApiResponseStatus.ERROR,
            error={
                "type": ErrorMessageType.ERROR,
                "message": str(e)
            }
        ))


