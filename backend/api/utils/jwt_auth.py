from rest_framework_simplejwt.tokens import AccessToken
from ..model.model import TaskAppUser


def get_logged_user(request):

    try:
        auth_header = request.headers.get(
            'Authorization'
        )

        if not auth_header:
            return None

        token = auth_header.split(' ')[1]

        decoded_token = AccessToken(token)

        user_id = decoded_token.get(
            'user_id'
        )

        user = TaskAppUser.objects.get(
            id=user_id
        )

        return user

    except Exception as e:
        print("JWT ERROR:", str(e))
        return None