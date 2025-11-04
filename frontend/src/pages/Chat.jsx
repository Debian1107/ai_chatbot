// src/pages/ChatPage.jsx
import React from "react";
import { Bot, Plus, Menu, Send, User, MessageSquare } from "lucide-react";

// Mock data for chat history
const mockChatHistory = [
  { id: 1, title: "Quantum Computing Explained" },
  { id: 2, title: "Best Tailwind CSS Practices" },
  { id: 3, title: "Plan a Weekend Trip to Paris" },
  { id: 4, title: "Recipe for Tiramisu" },
];

// Mock data for the current conversation
const mockConversation = [
  {
    id: 1,
    role: "user",
    text: "Can you explain the main difference between a neural network and a regular algorithm?",
  },
  {
    id: 2,
    role: "ai",
    text: "That's a great question! The core difference lies in how they learn. A **regular algorithm** is a set of explicit instructions designed by a programmer to solve a specific problem. It follows the same path every time. A **neural network**, on the other hand, is a machine learning model inspired by the human brain. It's designed to learn patterns and relationships directly from data (training) without being explicitly programmed for the task. It adapts and improves its performance over time.",
  },
  {
    id: 3,
    role: "user",
    text: "What about a practical example?",
  },
  {
    id: 4,
    role: "ai",
    text: "Certainly. Imagine **sorting a list of numbers (regular algorithm)**: you explicitly tell the computer, 'compare the first two, swap if needed, move to the next pair,' and so on (e.g., Bubble Sort). Now imagine **identifying a cat in a photo (neural network)**: you don't write explicit rules like 'if it has pointy ears and whiskers, it's a cat.' Instead, you show the network thousands of cat and non-cat images, and it figures out the necessary features on its own.",
  },
  {
    id: 5,
    role: "ai",
    text: "Certainly. Imagine **sorting a list of numbers (regular algorithm)**: you explicitly tell the computer, 'compare the first two, swap if needed, move to the next pair,' and so on (e.g., Bubble Sort). Now imagine **identifying a cat in a photo (neural network)**: you don't write explicit rules like 'if it has pointy ears and whiskers, it's a cat.' Instead, you show the network thousands of cat and non-cat images, and it figures out the necessary features on its own.",
  },
  {
    id: 6,
    role: "ai",
    text: "Certainly. Imagine **sorting a list of numbers (regular algorithm)**: you explicitly tell the computer, 'compare the first two, swap if needed, move to the next pair,' and so on (e.g., Bubble Sort). Now imagine **identifying a cat in a photo (neural network)**: you don't write explicit rules like 'if it has pointy ears and whiskers, it's a cat.' Instead, you show the network thousands of cat and non-cat images, and it figures out the necessary features on its own.",
  },
  {
    id: 7,
    role: "ai",
    text: "Certainly. Imagine **sorting a list of numbers (regular algorithm)**: you explicitly tell the computer, 'compare the first two, swap if needed, move to the next pair,' and so on (e.g., Bubble Sort). Now imagine **identifying a cat in a photo (neural network)**: you don't write explicit rules like 'if it has pointy ears and whiskers, it's a cat.' Instead, you show the network thousands of cat and non-cat images, and it figures out the necessary features on its own.",
  },
  {
    id: 8,
    role: "ai",
    text: "Certainly. Imagine **sorting a list of numbers (regular algorithm)**: you explicitly tell the computer, 'compare the first two, swap if needed, move to the next pair,' and so on (e.g., Bubble Sort). Now imagine **identifying a cat in a photo (neural network)**: you don't write explicit rules like 'if it has pointy ears and whiskers, it's a cat.' Instead, you show the network thousands of cat and non-cat images, and it figures out the necessary features on its own.",
  },
  {
    id: 9,
    role: "ai",
    text: "Certainly. Imagine **sorting a list of numbers (regular algorithm)**: you explicitly tell the computer, 'compare the first two, swap if needed, move to the next pair,' and so on (e.g., Bubble Sort). Now imagine **identifying a cat in a photo (neural network)**: you don't write explicit rules like 'if it has pointy ears and whiskers, it's a cat.' Instead, you show the network thousands of cat and non-cat images, and it figures out the necessary features on its own.",
  },
  {
    id: 10,
    role: "ai",
    text: "Certainly. Imagine **sorting a list of numbers (regular algorithm)**: you explicitly tell the computer, 'compare the first two, swap if needed, move to the next pair,' and so on (e.g., Bubble Sort). Now imagine **identifying a cat in a photo (neural network)**: you don't write explicit rules like 'if it has pointy ears and whiskers, it's a cat.' Instead, you show the network thousands of cat and non-cat images, and it figures out the necessary features on its own.",
  },
  {
    id: 11,
    role: "ai",
    text: "Certainly. Imagine **sorting a list of numbers (regular algorithm)**: you explicitly tell the computer, 'compare the first two, swap if needed, move to the next pair,' and so on (e.g., Bubble Sort). Now imagine **identifying a cat in a photo (neural network)**: you don't write explicit rules like 'if it has pointy ears and whiskers, it's a cat.' Instead, you show the network thousands of cat and non-cat images, and it figures out the necessary features on its own.",
  },
  {
    id: 12,
    role: "ai",
    text: "Certainly. Imagine **sorting a list of numbers (regular algorithm)**: you explicitly tell the computer, 'compare the first two, swap if needed, move to the next pair,' and so on (e.g., Bubble Sort). Now imagine **identifying a cat in a photo (neural network)**: you don't write explicit rules like 'if it has pointy ears and whiskers, it's a cat.' Instead, you show the network thousands of cat and non-cat images, and it figures out the necessary features on its own.",
  },
  {
    id: 13,
    role: "ai",
    text: "Certainly. Imagine **sorting a list of numbers (regular algorithm)**: you explicitly tell the computer, 'compare the first two, swap if needed, move to the next pair,' and so on (e.g., Bubble Sort). Now imagine **identifying a cat in a photo (neural network)**: you don't write explicit rules like 'if it has pointy ears and whiskers, it's a cat.' Instead, you show the network thousands of cat and non-cat images, and it figures out the necessary features on its own.",
  },
  {
    id: 14,
    role: "ai",
    text: "Certainly. Imagine **sorting a list of numbers (regular algorithm)**: you explicitly tell the computer, 'compare the first two, swap if needed, move to the next pair,' and so on (e.g., Bubble Sort). Now imagine **identifying a cat in a photo (neural network)**: you don't write explicit rules like 'if it has pointy ears and whiskers, it's a cat.' Instead, you show the network thousands of cat and non-cat images, and it figures out the necessary features on its own.",
  },
];

const ChatPage = () => {
  // Simple state to simulate which chat is currently active
  const activeChatId = 2; // For 'Best Tailwind CSS Practices'

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
        <button className="flex items-center justify-center w-full px-4 py-3 mb-6 text-sm font-semibold rounded-lg text-gray-900 bg-indigo-500 hover:bg-indigo-400 transition duration-200 shadow-md">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </button>

        {/* Chat History */}
        <nav className="flex-grow overflow-y-auto space-y-2">
          <p className="text-xs text-gray-400 uppercase mb-2">History</p>
          {mockChatHistory.map((chat) => (
            <a
              key={chat.id}
              href={`/chat/${chat.id}`} // Example link
              className={`flex items-center px-3 py-2 text-sm rounded-lg truncate transition duration-150 ${
                chat.id === activeChatId
                  ? "bg-gray-800 text-indigo-400 font-semibold"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
              title={chat.title}
            >
              <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
              {chat.title}
            </a>
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
            {mockChatHistory.find((c) => c.id === activeChatId)?.title ||
              "New Chat"}
          </h2>
        </header>

        {/* Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          <div className="max-w-4xl mx-auto">
            {mockConversation.map((message) => (
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
                  <div className="flex-shrink-0 mr-3">
                    {message.role === "user" ? (
                      <User className="w-6 h-6 bg-indigo-400 p-1 rounded-full" />
                    ) : (
                      <Bot className="w-6 h-6 text-indigo-600" />
                    )}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Input Area */}
        <div className="p-4 sm:p-6 border-t bg-white">
          <div className="max-w-4xl mx-auto flex items-end bg-gray-50 rounded-xl border border-gray-300 shadow-lg">
            <textarea
              className="flex-grow p-4 resize-none bg-transparent focus:outline-none text-gray-800 placeholder-gray-500 text-base"
              rows="1"
              placeholder="Message ChatAI..."
              style={{ minHeight: "52px" }} // Ensures minimum height even on one row
            />
            <button className="flex-shrink-0 m-2 p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300">
              <Send className="w-5 h-5" />
            </button>
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
