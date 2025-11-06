from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ChatSession, Chats
from .serializers import ChatSessionSerializer, MessageSerializer
import google.generativeai as genai  # Gemini SDK
from rest_framework_simplejwt.authentication import (
    JWTAuthentication,
)  # <--- Make sure this is imported

# Initialize Gemini
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


class ChatSessionListCreateView(generics.ListCreateAPIView):
    authentication_classes = [JWTAuthentication]  # <--- CRITICAL
    serializer_class = ChatSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        chat_session_inst = ChatSession.objects.filter(user=self.request.user)
        print(chat_session_inst.values())
        return Response({"success": True, "data": chat_session_inst.values()})

    def post(self, serializer):
        chat_session_creation = serializer.save(user=self.request.user)
        if chat_session_creation:
            return Response({"success": True, "data": chat_session_creation.data})
        return Response({"success": False, "msg": "Chat Session Creation Failed"})


class MessageCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        chat_id = request.GET.get("session")
        print("----------------Chat ID:", chat_id, request.GET)
        try:
            chat = ChatSession.objects.get(id=chat_id, user=request.user)
            messages = Chats.objects.filter(chat=chat_id).values()
            return Response({"success": True, "data": list(messages)})
        except ChatSession.DoesNotExist:
            return Response(
                {"success": False, "msg": "Chat session not found."}, status=404
            )

    def post(self, request):
        try:
            chat_id = request.data.get("chat_id")
            content = request.data.get("content")
            if chat_id:
                chat = ChatSession.objects.get(id=chat_id, user=request.user)
            else:
                chat = ChatSession.objects.create(
                    user=request.user, stream_name="new chat", status="active"
                )
            # check last message
            # last_message = Chats.objects.filter(chat=chat).order_by('-created_at').first()
            # Save user message
            user_chat_inst = Chats.objects.create(
                chat=chat, role="user", content=content
            )

            # Get context (past messages)
            # history = "\n".join([f"{m.role}: {m.content}" for m in chat.chats.all()])
            history = "\n".join([f"{m.role}: {m.content}" for m in chat.streams.all()])

            # Call Gemini API
            model = genai.GenerativeModel("models/gemini-2.5-flash")
            response = model.generate_content(f"{history}\nUser: {content}\nAssistant:")

            reply = response.text.strip()

            # Save assistant response
            chat_inst = Chats.objects.create(chat=chat, role="assistant", content=reply)

            return Response(
                {
                    "success": True,
                    "data": [
                        {
                            "id": user_chat_inst.id,
                            "chat_id": user_chat_inst.chat.id,
                            "role": user_chat_inst.role,
                            "content": user_chat_inst.content,
                            "created_at": user_chat_inst.created_at,
                        },
                        {
                            "id": chat_inst.id,
                            "chat_id": chat_inst.chat.id,
                            "role": chat_inst.role,
                            "content": chat_inst.content,
                            "created_at": chat_inst.created_at,
                        },
                    ],
                }
            )
        except Exception as e:
            print("Error in MessageCreateView:", str(e))
            return Response({"success": False, "msg": str(e)}, status=400)
