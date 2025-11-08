// src/pages/ChatPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { Bot, Plus, Menu, Send, User, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import generateToken from "../utils/token_gen";
import { useNavigate } from "react-router-dom";

const authToken = localStorage.getItem("access_token");
// Mock data for chat history
const mockChatHistory = [
  { id: 1, title: "Quantum Computing Explained" },
  { id: 2, title: "Best Tailwind CSS Practices" },
  { id: 3, title: "Plan a Weekend Trip to Paris" },
  { id: 4, title: "Recipe for Tiramisu" },
];

// Mock data for the current conversation
const mockConversation = [];

const ChatPage = () => {
  // Simple state to simulate which chat is currently active
  // const activeChatId = 2; // For 'Best Tailwind CSS Practices'
  const [loading, setLoading] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState(mockConversation);
  const [chatSessions, setChatSessions] = useState(mockChatHistory);
  const [isChatEnded, setIsChatEnded] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const handleChat = async () => {
    setLoading(true);
    setUserMessage("");

    const userMessageTrimmed = userMessage.trim();
    setChatMessages((prev) => [
      ...prev,
      { id: prev.length + 10, role: "user", content: userMessageTrimmed },
      { id: prev.length + 11, role: "ai", content: "", loading: true },
    ]);

    console.log("Chat sent");
    const sendMessage = await fetch("http://localhost:8000/api/chat/message/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: activeChat,
        content: userMessageTrimmed,
      }),
    });

    if (sendMessage.ok) {
      const data = await sendMessage.json();
      console.log(data);
      // setChatMessages((prev) => );
      setChatMessages([...chatMessages, ...data.data]);
    } else {
      alert("unable to send message");
      setUserMessage(userMessageTrimmed);
      console.error("Error sending message");
    }
    setLoading(false);
  };

  const fetchChatSessions = async () => {
    // const authToken = localStorage.getItem("access_token");
    const response = await fetch("http://localhost:8000/api/chat/session", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 401) {
      const tokenGenerated = await generateToken();
      if (tokenGenerated) {
        console.log("Retrying to send message after token refresh...");
        return handleChat(); // Retry sending the message
      } else {
        navigate("/logout");
        alert("Session expired. Please log in again.");
        setLoading(false);
        return;
      }
    }
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setActiveChat(data.data?.[0]?.id || null);
      setChatSessions(data.data || []);
    } else {
      console.error("Error fetching chat sessions");
    }
  };

  const fetchChatMessages = async (sessionId) => {
    // const authToken = localStorage.getItem("access_token");
    const response = await fetch(
      `http://localhost:8000/api/chat/message/?session=${sessionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setChatMessages(data.data || []);
      console.log("chat data from session is ", data);
    } else {
      console.error("Error fetching chat messages");
    }
  };
  const handleNewSession = async () => {
    const response = await fetch("http://localhost:8000/api/chat/session/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log("This is active chat POST response ", data);
      setChatSessions((prev) => [data.data, ...prev]);
    } else {
      let data = null;
      try {
        data = await response.json();
      } catch (error) {
        console.log("Error parsing JSON response: ", error);
        data = { message: "Unable to create new chat session" };
      }
      alert(data.message);
      console.error("Error posting chat sessions ", response);
    }
  };

  const handleSessionClick = async (activeSession) => {
    setActiveChat(activeSession.id);
    fetchChatMessages(activeSession.id);
    setIsChatEnded(activeSession.status === "completed" ? true : false);
  };

  const handleChatEnd = async () => {
    setLoading(true);
    setUserMessage("");

    console.log("Chat sent");
    const sendMessage = await fetch(
      "http://localhost:8000/api/chat/session/end",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_session_id: activeChat,
        }),
      }
    );

    if (sendMessage.ok) {
      const data = await sendMessage.json();
      console.log("chat end response ------------ ", data);
      setIsChatEnded(true);
      // setChatMessages((prev) => );
    } else {
      alert("unable to send message");
      console.error("Error sending message");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChatSessions();
    // fetchChatMessages(activeChat);
  }, []);
  useEffect(() => {
    console.log("scrolling into view", messagesEndRef);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 1. Sidebar - Chat History & Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 text-white p-4">
        {/* Logo/Title */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
          <h1 className="text-xl font-bold text-indigo-400">
            <Bot className="inline-block w-5 h-5 mr-1" />
            ChatAI
          </h1>
          {/* Menu icon for mobile/collapsing might go here */}
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleNewSession}
          className="flex items-center justify-center w-full px-4 py-3 mb-6 text-sm font-semibold rounded-lg text-gray-900 bg-indigo-500 hover:bg-indigo-400 transition duration-200 shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </button>

        {/* Chat History */}
        <nav className="grow overflow-y-auto space-y-2">
          <p className="text-xs text-gray-400 uppercase mb-2">History</p>
          {chatSessions.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleSessionClick(chat)}
              className={`flex items-center px-3 py-2 text-sm rounded-lg truncate transition duration-150 ${
                chat.id === activeChat
                  ? "bg-gray-800 text-indigo-400 font-semibold"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
              title={chat.title}
            >
              <MessageSquare className="w-4 h-4 mr-2 shrink-0" />
              {chat.stream_name}
            </button>
          ))}
        </nav>

        {/* User Account/Settings Placeholder */}
        <div className="mt-auto border-t border-gray-700 pt-4">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm mr-3">
              JD
            </div>
            <div>
              <p className="text-sm font-semibold">John Doe</p>
              <p className="text-xs text-gray-400">Settings & Sign Out</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Chat Area */}
      <main className="flex flex-col flex-1">
        {/* Top Bar for Mobile/Context */}
        <header className="flex items-center p-4 md:hidden bg-white shadow-sm">
          <Menu className="w-6 h-6 text-gray-600 mr-3 cursor-pointer" />
          <h2 className="text-lg font-semibold truncate">
            {chatSessions.find((c) => c.id === activeChat)?.title || "New Chat"}
          </h2>
        </header>

        {/* Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          <div className="max-w-4xl mx-auto">
            {chatMessages.length === 0 && (
              <div className="text-center text-gray-500 mt-20">
                <p className="mb-4">No messages yet. Start the conversation!</p>
                <Bot className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
                <p className="text-sm">
                  Type your message in the input box below and hit Enter to chat
                  with ChatAI.
                </p>
              </div>
            )}
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-6 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-3xl p-4 rounded-xl shadow-md ${
                    message.role === "user"
                      ? "bg-indigo-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  <div className="shrink-0 mr-3">
                    {message.role === "user" ? (
                      <User className="w-6 h-6 bg-indigo-400 p-1 rounded-full" />
                    ) : (
                      <Bot className="w-6 h-6 text-indigo-600" />
                    )}
                  </div>
                  {message?.loading ? (
                    <p>
                      <span className="animate-pulse">ChatAI is typing...</span>
                    </p>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div
              className="w-full  flex justify-center items-center "
              ref={messagesEndRef}
            >
              {chatMessages && chatMessages.length > 0 && !isChatEnded && (
                <button
                  onClick={handleChatEnd}
                  className="p-2 rounded-2xl text-white bg-indigo-800 border border-violet-400 w-fit text-[12px] cursor-pointer"
                >
                  END CHAT
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. Input Area */}
        <div className="p-4 sm:p-6 border-t bg-white ">
          <div className="max-w-4xl mx-auto flex items-end bg-gray-50 rounded-xl border border-gray-300 shadow-lg">
            {isChatEnded ? (
              <div className="w-full p-4 text-center text-gray-500 flex flex-col justify-center items-center gap-5">
                <p className="h-[120px] overflow-auto">
                  {chatSessions.find((c) => c.id === activeChat)
                    ?.stream_summary || ""}
                  This chat has ended. Please start a new chat to continue the
                  conversation. This chat has ended. Please start a new chat to
                  continue the conversation. This chat has ended. Please start a
                  new chat to continue the conversation. This chat has ended.
                  Please start a new chat to continue the conversation. This
                  chat has ended. Please start a new chat to continue the
                  conversation. This chat has ended. Please start a new chat to
                  continue the conversation. This chat has ended. Please start a
                  new chat to continue the conversation.
                </p>
                <p className="text-white bg-red-500 w-fit rounded-xl p-1  text-base">
                  This chat has ended. Please start a new chat to continue the
                  conversation.
                </p>
              </div>
            ) : (
              <>
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!loading && userMessage.trim() !== "") {
                        handleChat();
                      }
                    }
                  }}
                  className="grow p-4 resize-none bg-transparent focus:outline-none text-gray-800 placeholder-gray-500 text-base"
                  rows="1"
                  placeholder="Message ChatAI..."
                  style={{ minHeight: "52px" }} // Ensures minimum height even on one row
                  disabled={loading}
                />
                <button
                  disabled={loading || userMessage.trim() === ""}
                  onClick={handleChat}
                  className={
                    (loading || userMessage.trim() === ""
                      ? "bg-gray-400"
                      : "bg-indigo-600 hover:bg-indigo-700 ") +
                    " shrink-0 m-2 p-3 rounded-xl  text-white transition duration-300 "
                  }
                >
                  <Send className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">
            ChatAI can make mistakes. Consider checking important information.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
