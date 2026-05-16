
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.view.hello')),
    path('api/', include('api.view.oath')),
    path('api/', include('api.view.task')),
]