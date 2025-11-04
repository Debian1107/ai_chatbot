from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ChatSession, Message
from .serializers import ChatSessionSerializer, MessageSerializer
import google.generativeai as genai  # Gemini SDK

# Initialize Gemini
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


class ChatSessionListCreateView(generics.ListCreateAPIView):
    serializer_class = ChatSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MessageCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, chat_id):
        chat = ChatSession.objects.get(id=chat_id, user=request.user)
        content = request.data.get("content")

        # Save user message
        user_msg = Message.objects.create(chat=chat, role="user", content=content)

        # Get context (past messages)
        history = "\n".join([f"{m.role}: {m.content}" for m in chat.messages.all()])

        # Call Gemini API
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(f"{history}\nUser: {content}\nAssistant:")

        reply = response.text.strip()

        # Save assistant response
        assistant_msg = Message.objects.create(
            chat=chat, role="assistant", content=reply
        )

        return Response(
            {
                "user_message": MessageSerializer(user_msg).data,
                "assistant_message": MessageSerializer(assistant_msg).data,
            }
        )
