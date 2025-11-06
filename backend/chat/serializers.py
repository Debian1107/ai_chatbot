from rest_framework import serializers
from .models import ChatSession, Chats


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chats
        fields = "__all__"
        read_only_fields = ["id", "created_at"]


class ChatSessionSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatSession
        fields = ["id", "title", "created_at", "messages"]
