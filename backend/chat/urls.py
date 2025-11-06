from django.urls import path
from .views import ChatSessionListCreateView, MessageCreateView

urlpatterns = [
    path("message/", MessageCreateView.as_view(), name="register"),
    path("session/", ChatSessionListCreateView.as_view(), name="register"),
]
