# AI Chatbot - RAG-Powered Conversational Assistant

A full-stack AI chatbot application built with Django REST Framework and React, featuring Retrieval-Augmented Generation (RAG) for context-aware conversations. The system uses Google Gemini AI, ChromaDB for vector storage, and LangChain for document processing and retrieval.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Sample Conversations](#sample-conversations)
- [Technology Stack](#technology-stack)

## Features

- 🤖 **AI-Powered Conversations**: Powered by Google Gemini 2.5 Flash model
- 🔍 **RAG (Retrieval-Augmented Generation)**: Context-aware responses using vector embeddings
- 💾 **Conversation Memory**: Persistent chat history with session management
- 📊 **Chat Summarization**: AI-generated summaries for completed conversations
- 🔐 **JWT Authentication**: Secure user authentication and authorization
- 🎨 **Modern UI**: Beautiful, responsive React frontend with Tailwind CSS
- 🐳 **Docker Support**: Easy deployment with Docker Compose
- 📈 **Vector Database**: ChromaDB for efficient semantic search

## Screenshots

### Homepage

![Homepage](./docs/screenshots/homepage.png)
_Landing page with hero section and feature highlights_

### Chat Interface

![Chat Interface](./docs/screenshots/chat-interface.png)
_Main chat interface with conversation history sidebar_

### Login Page

![Login Page](./docs/screenshots/login.png)
_User authentication page_

### Chat Session

![Chat Session](./docs/screenshots/chat-session.png)
_Active chat session with AI responses_

> **Note**: Please add your screenshots to the `docs/screenshots/` directory. The images should be named:
>
> - `homepage.png`
> - `chat-interface.png`
> - `login.png`
> - `chat-session.png`

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         React Frontend                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  HomePage   │  │  LoginPage  │  │  ChatPage   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│         │                │                │                     │
│         └────────────────┴────────────────┘                     │
│                            │                                    │
│                    HTTP/REST API                                │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Django REST Backend                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Accounts   │  │     Chat     │  │   RAG Bot    │         │
│  │     API      │  │     API      │  │   Module     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                │                │                     │
│         └────────────────┴────────────────┘                     │
│                            │                                    │
└────────────────────────────┼────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  PostgreSQL  │    │   ChromaDB   │    │ Gemini API   │
│   Database   │    │  Vector Store│    │   (Google)   │
│              │    │              │    │              │
│ - Users      │    │ - Embeddings │    │ - AI Model   │
│ - Sessions   │    │ - Documents  │    │ - Responses  │
│ - Messages   │    │ - Metadata   │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Conversation Flow

```
1. User sends message
   │
   ├─► Save user message to PostgreSQL
   │
   ├─► Retrieve conversation history
   │
   ├─► Build/Update ChromaDB vector store
   │   │
   │   ├─► Convert messages to embeddings
   │   ├─► Store in ChromaDB with metadata
   │   └─► Perform semantic search (k=8)
   │
   ├─► Retrieve relevant context (RAG)
   │
   ├─► Generate prompt with context
   │   │
   │   └─► Send to Gemini API
   │
   ├─► Receive AI response
   │
   ├─► Save assistant message to PostgreSQL
   │
   └─► Return response to frontend
```

### Data Storage Flow

```
User Message
    │
    ▼
PostgreSQL (Chats table)
    │
    ├─► Store message with metadata
    │   - role (user/assistant)
    │   - content
    │   - chat_id (foreign key)
    │   - created_at
    │
    ▼
ChromaDB Vector Store
    │
    ├─► Document creation
    │   - page_content: message content
    │   - metadata: user, chat_id, timestamp
    │
    ├─► Text splitting
    │   - chunk_size: 800
    │   - chunk_overlap: 150
    │
    ├─► Embedding generation
    │   - Model: all-MiniLM-L6-v2
    │
    └─► Vector storage
        - Persistent storage
        - Semantic search index
```

## Setup Instructions

### Prerequisites

- Docker and Docker Compose installed
- Python 3.12+ (for local development)
- Node.js 20+ (for local development)
- PostgreSQL 15+ (if running locally)
- Google Gemini API key

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
POSTGRES_DB=ai_chatbot_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Django
SECRET_KEY=your_django_secret_key_here
DEBUG=True
```

### Docker Setup (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai_chatbot
   ```

2. **Create environment file**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Build and start containers**

   ```bash
   docker-compose up --build
   ```

4. **Run database migrations**

   ```bash
   docker-compose exec backend python manage.py migrate
   ```

5. **Create superuser (optional)**

   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

### Local Development Setup

#### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Create virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up PostgreSQL database**

   - Create a database named `ai_chatbot_db`
   - Update `settings.py` with your database credentials

5. **Run migrations**

   ```bash
   python manage.py migrate
   ```

6. **Create superuser**

   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server**
   ```bash
   python manage.py runserver
   ```

#### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000

### Troubleshooting

- **Database connection errors**: Ensure PostgreSQL is running and credentials are correct
- **CORS errors**: Check `CORS_ALLOWED_ORIGINS` in `settings.py`
- **API key errors**: Verify `GEMINI_API_KEY` is set in your `.env` file
- **Port conflicts**: Change ports in `docker-compose.yml` if 3000, 8000, or 5433 are in use

## API Documentation

### OpenAPI Specification

The complete OpenAPI 3.0 specification is available in [`docs/openapi.yaml`](./docs/openapi.yaml).

### Quick API Reference

#### Authentication Endpoints

**Register User**

```http
POST /api/auth/register/
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "password2": "SecurePass123",
  "bio": "Software developer"
}
```

**Login**

```http
POST /api/auth/login/
Content-Type: application/json

{
  "username": "johndoe",
  "password": "SecurePass123"
}

Response:
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "Software developer"
  }
}
```

**Refresh Token**

```http
POST /api/auth/token/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Get Profile**

```http
GET /api/auth/profile/
Authorization: Bearer <access_token>
```

#### Chat Endpoints

**Get Chat Sessions**

```http
GET /api/chat/session/
Authorization: Bearer <access_token>

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "stream_name": "Quantum Computing Explained",
      "stream_summary": "",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z",
      "ended_at": null
    }
  ]
}
```

**Create Chat Session**

```http
POST /api/chat/session/
Authorization: Bearer <access_token>
Content-Type: application/json

Response:
{
  "success": true,
  "data": {
    "id": 2,
    "stream_name": "New Chat",
    "stream_summary": "",
    "status": "active",
    "created_at": "2024-01-15T11:00:00Z",
    "ended_at": null
  }
}
```

**Get Messages**

```http
GET /api/chat/message/?session=1
Authorization: Bearer <access_token>

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "role": "user",
      "content": "What is quantum computing?",
      "created_at": "2024-01-15T10:31:00Z",
      "chat": 1
    },
    {
      "id": 2,
      "role": "assistant",
      "content": "Quantum computing is a type of computation...",
      "created_at": "2024-01-15T10:31:05Z",
      "chat": 1
    }
  ]
}
```

**Send Message**

```http
POST /api/chat/message/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "chat_id": 1,
  "content": "How does quantum entanglement work?"
}

Response:
{
  "success": true,
  "data": [
    {
      "id": 3,
      "chat_id": 1,
      "role": "user",
      "content": "How does quantum entanglement work?",
      "created_at": "2024-01-15T10:32:00Z"
    },
    {
      "id": 4,
      "chat_id": 1,
      "role": "assistant",
      "content": "Quantum entanglement is a phenomenon where...",
      "created_at": "2024-01-15T10:32:03Z"
    }
  ]
}
```

**End Chat Session (Generate Summary)**

```http
POST /api/chat/session/end
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "chat_session_id": 1
}

Response:
{
  "success": true,
  "msg": "Summary generation started."
}
```

### API Response Format

All API responses follow this structure:

**Success Response**

```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response**

```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... }
}
```

## Sample Conversations

### Conversation 1: Quantum Computing

**User**: What is quantum computing?

**AI**: Quantum computing is a revolutionary computing paradigm that leverages the principles of quantum mechanics to process information in fundamentally different ways than classical computers. Unlike classical bits that can only exist in states of 0 or 1, quantum bits (qubits) can exist in a superposition of both states simultaneously, allowing quantum computers to perform certain calculations exponentially faster than classical computers.

**User**: How does quantum entanglement work?

**AI**: Quantum entanglement is a fascinating phenomenon where two or more particles become correlated in such a way that the quantum state of each particle cannot be described independently, even when separated by large distances. When particles are entangled, measuring the state of one particle instantly determines the state of the other, regardless of the distance between them. This "spooky action at a distance," as Einstein called it, is one of the key resources that quantum computers use to perform computations.

**User**: What are the practical applications?

**AI**: Quantum computing has several promising practical applications:

1. **Cryptography**: Breaking current encryption methods and developing quantum-resistant encryption
2. **Drug Discovery**: Simulating molecular interactions to design new pharmaceuticals
3. **Optimization Problems**: Solving complex optimization problems in logistics, finance, and supply chain management
4. **Machine Learning**: Accelerating AI training and improving pattern recognition
5. **Financial Modeling**: Risk analysis and portfolio optimization
6. **Climate Modeling**: Simulating complex climate systems

While we're still in the early stages, companies like IBM, Google, and others are making significant progress toward practical quantum computers.

**AI-Generated Summary**:
"This conversation explored quantum computing fundamentals, including quantum entanglement and superposition. The discussion covered practical applications in cryptography, drug discovery, optimization, and machine learning. The user demonstrated interest in understanding both theoretical concepts and real-world implementations of quantum computing technology."

### Conversation 2: Web Development

**User**: What are the best practices for React development?

**AI**: Here are some essential best practices for React development:

1. **Component Structure**: Keep components small, focused, and reusable
2. **State Management**: Use React hooks (useState, useEffect) appropriately and consider Context API or state management libraries for complex apps
3. **Performance**: Implement React.memo, useMemo, and useCallback to optimize re-renders
4. **Code Organization**: Follow a consistent folder structure and separate concerns
5. **Type Safety**: Use TypeScript or PropTypes for type checking
6. **Testing**: Write unit tests and integration tests for your components
7. **Accessibility**: Ensure your components are accessible with proper ARIA labels

**User**: How do I optimize React performance?

**AI**: React performance optimization involves several strategies:

1. **Memoization**: Use `React.memo()` for functional components, `useMemo()` for expensive computations, and `useCallback()` for function references
2. **Code Splitting**: Implement lazy loading with `React.lazy()` and `Suspense`
3. **Virtualization**: Use libraries like `react-window` for long lists
4. **Avoid Unnecessary Re-renders**: Carefully manage dependencies in hooks and avoid creating objects/arrays in render
5. **Bundle Size**: Use tools like `webpack-bundle-analyzer` to identify and reduce bundle size
6. **Profiling**: Use React DevTools Profiler to identify performance bottlenecks

**AI-Generated Summary**:
"Discussion focused on React development best practices, covering component structure, state management, and performance optimization techniques. The conversation provided actionable advice on memoization, code splitting, and performance profiling for React applications."

### Conversation 3: Machine Learning

**User**: Explain the difference between supervised and unsupervised learning.

**AI**: The key difference lies in the presence of labeled data:

**Supervised Learning**:

- Uses labeled training data (input-output pairs)
- The algorithm learns to map inputs to known outputs
- Examples: classification (spam detection), regression (price prediction)
- Common algorithms: Linear Regression, Decision Trees, Neural Networks

**Unsupervised Learning**:

- Works with unlabeled data
- Discovers hidden patterns or structures in data
- Examples: clustering (customer segmentation), dimensionality reduction
- Common algorithms: K-Means, PCA, Autoencoders

**User**: What about reinforcement learning?

**AI**: Reinforcement Learning (RL) is a third paradigm where an agent learns to make decisions by interacting with an environment:

- **Agent**: The learner/decision maker
- **Environment**: The world the agent interacts with
- **Rewards**: Feedback signal (positive or negative) for actions
- **Policy**: The strategy the agent uses to determine actions

Unlike supervised learning, there's no labeled dataset. Instead, the agent learns through trial and error, receiving rewards or penalties for its actions. This makes RL excellent for problems like game playing (AlphaGo, Chess), robotics, autonomous driving, and recommendation systems.

**AI-Generated Summary**:
"Explored machine learning paradigms, comparing supervised, unsupervised, and reinforcement learning approaches. The conversation covered key characteristics, use cases, and algorithms for each learning type, providing a comprehensive overview of ML fundamentals."

## Technology Stack

### Backend

- **Framework**: Django 5.0+
- **API**: Django REST Framework
- **Authentication**: djangorestframework-simplejwt
- **Database**: PostgreSQL 15
- **Vector Database**: ChromaDB
- **AI/ML**:
  - Google Gemini API (gemini-2.5-flash)
  - LangChain
  - Sentence Transformers (all-MiniLM-L6-v2)

### Frontend

- **Framework**: React 19
- **Routing**: React Router DOM 7
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite 7
- **Markdown**: React Markdown

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Web Server**: Django Development Server (backend)
- **Dev Server**: Vite Dev Server (frontend)

## Project Structure

```
ai_chatbot/
├── backend/
│   ├── accounts/          # User authentication app
│   ├── chat/              # Chat functionality app
│   │   ├── chatbotrag.py  # RAG implementation
│   │   ├── models.py      # ChatSession, Chats models
│   │   └── views.py       # API views
│   ├── ai_chat_backend/   # Django project settings
│   ├── chroma_db/         # ChromaDB persistent storage
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── docs/
│   ├── screenshots/       # UI screenshots
│   └── openapi.yaml       # API documentation
├── docker-compose.yml
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue in the repository.
