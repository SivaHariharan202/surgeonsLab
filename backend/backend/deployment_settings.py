import os
import dj_database_url
from .settings import *
from .settings import BASE_DIR

ALLOWED_HOSTS == [os.environ.get['RENDER_EXTERNAL_HOST_NAME']]
CSRF_TRUSTED_ORIGINS =['https://'+os.environ.get['RENDER_EXTERNAL_HOST_NAME']]

DEBUG=False

SECRET_KEY= os.environ.get['SECRET_KEY']

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'whitenoise.middleware.whiteNoiseMiddleware', 
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

CORS_ALLOWD_ORIGINS = ['http://localhost:8000']


STORAGE ={
    "defaults":{
        "BACKEND":"django.core.files.storage.FileSystemStorage"
    },
    "staticfiles":{
        "BACKEND":"whitenoise.storage.CompressedStaticFilesStorage"
    }
}



# DATABASES = {
#     'default':dj_database_url.config(
#             default =os.environ['DATABASE_URL'],
#             conn_max_age
#     )
# }



# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'test_db',
#         'USER': 'postgres',        # or fabric_user
#         'PASSWORD': 'Sivahari@123',
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }


