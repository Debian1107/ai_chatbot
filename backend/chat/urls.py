from django.urls import path
from .views import ChatSessionListCreateView, MessageCreateView, ChatSessionSummary

urlpatterns = [
    path("message/", MessageCreateView.as_view(), name="message"),
    path("session/", ChatSessionListCreateView.as_view(), name="session"),
    path("session/end", ChatSessionSummary.as_view(), name="summary"),
]
