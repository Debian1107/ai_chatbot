// src/pages/HomePage.jsx
import React from "react";
import { Bot, Zap, TrendingUp, ArrowRight } from "lucide-react"; // Example icons

// Data for feature section
const features = [
  {
    icon: Zap,
    title: "Blazing Fast Responses",
    description:
      "Get immediate answers to complex questions, powered by the latest AI model.",
  },
  {
    icon: TrendingUp,
    title: "Contextual Memory",
    description:
      "The AI remembers your previous messages to maintain a fluid and relevant conversation.",
  },
  {
    icon: Bot,
    title: "Multilingual Support",
    description:
      "Chat in dozens of languages with native-level fluency and understanding.",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Navigation Bar (Placeholder) */}
      <header className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-indigo-600">
          <Bot className="inline-block w-6 h-6 mr-2" />
          ChatAI
        </h1>
        <nav className="hidden md:flex space-x-8">
          <a
            href="#"
            className="text-gray-600 hover:text-indigo-600 transition"
          >
            Features
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-indigo-600 transition"
          >
            Pricing
          </a>
          <a
            href="/login"
            className="text-gray-600 hover:text-indigo-600 transition"
          >
            Sign In
          </a>
        </nav>
        <a
          href="/signup"
          className="px-4 py-2 text-sm font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300"
        >
          Start Chatting
        </a>
      </header>

      {/* 2. Hero Section - Dark & Dramatic */}
      <section className="bg-gray-900 text-white pt-20 pb-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-6xl font-extrabold tracking-tight sm:text-7xl mb-6 leading-tight">
            The Future of{" "}
            <span className="text-indigo-400">Conversational AI</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Your personal, intelligent assistant is ready. Ask anything, create
            anything, and learn effortlessly.
          </p>

          <div className="flex justify-center space-x-4 mb-16">
            <a
              href="/signup"
              className="px-8 py-4 text-xl font-bold rounded-full text-gray-900 bg-indigo-400 hover:bg-indigo-300 shadow-lg transition transform hover:scale-105 duration-300 flex items-center"
            >
              Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <a
              href="#"
              className="px-8 py-4 text-xl font-bold rounded-full text-white border-2 border-indigo-600 hover:bg-indigo-600 transition duration-300"
            >
              See Demo
            </a>
          </div>

          {/* AI Chat Mockup */}
          <div className="relative mx-auto w-full max-w-xl">
            {/* Simple, sleek mockup of a chat window */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-indigo-500/50">
              <div className="h-40 overflow-hidden space-y-3">
                <div className="flex justify-end">
                  <div className="bg-indigo-500 text-sm p-3 rounded-t-xl rounded-bl-xl max-w-xs">
                    How does quantum computing work?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-sm p-3 rounded-tr-xl rounded-b-xl max-w-md">
                    Quantum computing harnesses superposition and entanglement
                    to process information in fundamentally new ways...
                  </div>
                </div>
              </div>
              <div className="mt-4 flex">
                <input
                  type="text"
                  placeholder="Type your message..."
                  disabled
                  className="flex-grow p-3 rounded-l-lg bg-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none"
                />
                <button
                  disabled
                  className="bg-indigo-600 p-3 rounded-r-lg hover:bg-indigo-700 transition"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section - Clean & Informative */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-extrabold text-gray-900 mb-12">
            Unleash Unrivaled Intelligence
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
              >
                <feature.icon className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Footer (Placeholder) */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto text-center text-sm">
          &copy; {new Date().getFullYear()} ChatAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
