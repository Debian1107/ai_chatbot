from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ChatSession, Chats
from .serializers import ChatSessionSerializer, MessageSerializer
import google.generativeai as genai  # Gemini SDK
from rest_framework_simplejwt.authentication import (
    JWTAuthentication,
)
import threading

# Initialize Gemini
import os
from .chatbotrag import ragbot, summarize_chat

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


class ChatSessionListCreateView(APIView):
    # authentication_classes = [JWTAuthentication]  # <--- CRITICAL
    serializer_class = ChatSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        chat_session_inst = ChatSession.objects.filter(user=self.request.user)
        print(chat_session_inst.values())
        return Response({"success": True, "data": chat_session_inst.values()})

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            chat_session = serializer.save(user=request.user)
            return Response(
                {"success": True, "data": self.serializer_class(chat_session).data},
                status=status.HTTP_201_CREATED,
            )

        print("Serializer errors:", serializer.errors)

        if serializer.errors.get("non_field_errors"):
            return Response(
                {"success": False, "message": serializer.errors["non_field_errors"][0]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"success": False, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


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
                return Response(
                    {"success": False, "msg": "chat_id is required."}, status=400
                )

            if chat.status != "active":
                return Response(
                    {"success": False, "msg": "Chat session is not active."}, status=400
                )

            if chat.stream_name == "New Chat":
                # print("what an awesome day this is -----------------")
                chat.stream_name = content[:30] + ("..." if len(content) > 30 else "")
                chat.save()

            # check last message
            # last_message = Chats.objects.filter(chat=chat).order_by('-created_at').first()
            # Save user message
            user_chat_inst = Chats.objects.create(
                chat=chat, role="user", content=content
            )

            # Get context (past messages)
            # MAX_MSG_LENGTH = 500  # or whatever limit you prefer
            # history_len = min(Chats.objects.filter(chat=chat).count(), 6)

            # # Safely fetch the most recent 6 messages in correct order
            # recent_messages = chat.streams.order_by("-created_at")[:history_len]
            # recent_messages = reversed(
            #     recent_messages
            # )  # put them back in chronological order

            # history = "\n".join(
            #     [
            #         f"{m.role}: {m.content[:MAX_MSG_LENGTH]}{'...' if len(m.content) > MAX_MSG_LENGTH else ''}"
            #         for m in recent_messages
            #     ]
            # )

            history = ragbot(
                chat.streams.all(),
                content,
            )

            print("History:", history, "\n\n\n", content)

            # Call Gemini API
            model = genai.GenerativeModel("models/gemini-2.5-flash")
            prompt = f"""
                        You are an AI assistant having an ongoing conversation with a user.
                        Here is the conversation so far:
                        {history}

                        Now, the user says:
                        "{content}"

                        Please respond helpfully and naturally, using the context from the conversation if needed.
                        Assistant:
                        """
            response = model.generate_content(prompt)

            # response = model.generate_content(f"{history}\nUser: {content}\nAssistant:")

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


class ChatSessionSummary(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            chat_session_id = request.data.get("chat_session_id", None)
            if not chat_session_id:
                return Response(
                    {"success": False, "msg": "chat_session_id is required."},
                    status=400,
                )

            chat_session_inst = ChatSession.objects.get(id=chat_session_id)

            # Run summarization in background
            def run_summary():
                try:
                    ai_summary = summarize_chat(chat_session_inst.streams.all())
                    chat_session_inst.stream_summary = ai_summary
                    # chat_session_inst.status = "completed"
                    chat_session_inst.save()
                    print("AI Summary generated for session:", chat_session_id)
                except Exception as e:
                    print("Background summary failed:", str(e))

            threading.Thread(target=run_summary, daemon=True).start()
            chat_session_inst.status = "completed"
            chat_session_inst.save()

            return Response(
                {"success": True, "msg": "Summary generation started."},
                status=status.HTTP_202_ACCEPTED,
            )

        except Exception as e:
            print("Error in ChatSessionSummary:", str(e))
            return Response({"success": False, "msg": str(e)}, status=400)
