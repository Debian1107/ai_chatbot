from rest_framework import serializers
from .models import ChatSession, Chats


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chats
        fields = "__all__"
        read_only_fields = ["id", "created_at"]


class ChatSessionSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChatSession
        fields = [
            "id",
            "stream_name",
            "created_at",
            "stream_summary",
            "created_at",
            "ended_at",
            "status",
        ]

    def validate(self, attrs):
        request = self.context.get("request", None)
        print("Request in serializer validate:", request)
        user = getattr(request, "user", None)

        if not user or not user.is_authenticated:
            raise serializers.ValidationError("User authentication required.")

        existing_empty = ChatSession.objects.filter(
            user=user, streams__isnull=True  # no related chat messages
        ).exists()

        if existing_empty:
            raise serializers.ValidationError(
                "You already have an empty chat session with no messages."
            )

        return attrs
