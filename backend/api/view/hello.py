from django.urls import path
from ..service.hello import HelloService
urlpatterns=[
    path("hello/",HelloService, name="hello")
] 