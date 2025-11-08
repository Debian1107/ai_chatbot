from django.db import models
from accounts.models import CustomUser


class ChatSession(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    stream_name = models.TextField(default="New Chat")
    stream_summary = models.TextField(default="", blank=True)
    status = models.CharField(
        max_length=50, default="active"
    )  # e.g., "active", "completed"

    created_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(default=None, null=True, blank=True)

    def __str__(self):
        return f"Stream for Chat ID {self.id} at {self.created_at}"


class Chats(models.Model):
    ROLE_CHOICES = (
        ("user", "User"),
        ("assistant", "Assistant"),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    # ai_response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    chat = models.ForeignKey(
        ChatSession, on_delete=models.CASCADE, related_name="streams"
    )

    def __str__(self):
        return f"Chat by {self.chat.user.username} at {self.created_at}"
