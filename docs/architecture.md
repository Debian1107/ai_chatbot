# Architecture Documentation

## System Architecture

### High-Level Overview

The AI Chatbot application follows a three-tier architecture:

1. **Frontend Tier**: React application serving the user interface
2. **Backend Tier**: Django REST Framework API handling business logic
3. **Data Tier**: PostgreSQL for relational data, ChromaDB for vector storage

### Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Frontend (Port 3000)              │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │ HomePage │  │ LoginPage│  │ ChatPage │          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  │       │             │             │                  │  │
│  │       └─────────────┴─────────────┘                  │  │
│  │                    │                                 │  │
│  │            HTTP/REST API Calls                       │  │
│  └────────────────────┼─────────────────────────────────┘  │
└───────────────────────┼─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        Django REST Framework (Port 8000)            │  │
│  │  ┌──────────────┐         ┌──────────────┐         │  │
│  │  │   Accounts   │         │     Chat     │         │  │
│  │  │     App      │         │     App      │         │  │
│  │  │              │         │              │         │  │
│  │  │ - Register   │         │ - Sessions   │         │  │
│  │  │ - Login      │         │ - Messages   │         │  │
│  │  │ - Profile    │         │ - RAG Bot    │         │  │
│  │  └──────┬───────┘         └──────┬───────┘         │  │
│  │         │                        │                  │  │
│  │         └────────┬───────────────┘                  │  │
│  │                  │                                  │  │
│  │         JWT Authentication                         │  │
│  └──────────────────┼──────────────────────────────────┘  │
└─────────────────────┼──────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  PostgreSQL  │ │   ChromaDB   │ │ Gemini API   │
│   Database   │ │ Vector Store │ │   (Google)   │
│              │ │              │ │              │
│ - Users      │ │ - Embeddings │ │ - AI Model   │
│ - Sessions   │ │ - Documents  │ │ - Responses  │
│ - Messages   │ │ - Metadata   │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

## Data Flow

### Message Processing Flow

```
User Input
    │
    ├─► Frontend: ChatPage Component
    │   │
    │   └─► HTTP POST /api/chat/message/
    │
    ▼
Backend: MessageCreateView
    │
    ├─► Validate Request (JWT, chat_id, content)
    │
    ├─► Save User Message → PostgreSQL (Chats table)
    │
    ├─► Retrieve Chat History
    │   │
    │   └─► Query: Chats.objects.filter(chat=chat_id)
    │
    ├─► RAG Process (ragbot function)
    │   │
    │   ├─► Build/Load Vector DB
    │   │   │
    │   │   ├─► Check if ChromaDB exists
    │   │   │
    │   │   ├─► Convert messages to Documents
    │   │   │   - page_content: message content
    │   │   │   - metadata: user, chat_id, timestamp
    │   │   │
    │   │   ├─► Text Splitting
    │   │   │   - chunk_size: 800
    │   │   │   - chunk_overlap: 150
    │   │   │
    │   │   ├─► Generate Embeddings
    │   │   │   - Model: all-MiniLM-L6-v2
    │   │   │   - SentenceTransformerEmbeddings
    │   │   │
    │   │   └─► Store in ChromaDB
    │   │
    │   ├─► Semantic Search
    │   │   │
    │   │   └─► Retrieve top k=8 similar documents
    │   │
    │   └─► Build Context String
    │
    ├─► Generate AI Response
    │   │
    │   ├─► Create Prompt
    │   │   - Include conversation history
    │   │   - Include retrieved context
    │   │   - Include current user message
    │   │
    │   ├─► Call Gemini API
    │   │   - Model: gemini-2.5-flash
    │   │   - Generate response
    │   │
    │   └─► Extract response text
    │
    ├─► Save AI Response → PostgreSQL (Chats table)
    │
    └─► Return Response to Frontend
        │
        └─► Update UI with user message and AI response
```

### Chat Session Creation Flow

```
User Clicks "New Chat"
    │
    ├─► Frontend: handleNewSession()
    │
    └─► HTTP POST /api/chat/session/
        │
        ▼
Backend: ChatSessionListCreateView.post()
    │
    ├─► Validate User (JWT)
    │
    ├─► Check for Empty Sessions
    │   │
    │   └─► Prevent duplicate empty sessions
    │
    ├─► Create ChatSession
    │   │
    │   ├─► user: request.user
    │   ├─► stream_name: "New Chat"
    │   ├─► status: "active"
    │   └─► created_at: auto
    │
    └─► Return Session Data
        │
        └─► Frontend: Update session list
```

### Chat Summarization Flow

```
User Clicks "End Chat"
    │
    ├─► Frontend: handleChatEnd()
    │
    └─► HTTP POST /api/chat/session/end
        │
        ▼
Backend: ChatSessionSummary.post()
    │
    ├─► Validate Request
    │
    ├─► Update Session Status → "completed"
    │
    ├─► Start Background Thread
    │   │
    │   └─► summarize_chat() function
    │       │
    │       ├─► Retrieve All Messages
    │       │
    │       ├─► Combine into Text
    │       │
    │       ├─► Split into Chunks (2000 chars, 300 overlap)
    │       │
    │       ├─► Generate Partial Summaries
    │       │   │
    │       │   └─► Call Gemini API for each chunk
    │       │
    │       ├─► Merge Summaries
    │       │   │
    │       │   └─► Call Gemini API with all summaries
    │       │
    │       └─► Save Summary → ChatSession.stream_summary
    │
    └─► Return Immediate Response
        │
        └─► Frontend: Display "Summary generation started"
```

## Database Schema

### PostgreSQL Tables

#### CustomUser
```sql
- id (Primary Key)
- username (Unique)
- email
- password (hashed)
- bio (Text, nullable)
- date_joined
- last_login
- is_active
- is_staff
- is_superuser
```

#### ChatSession
```sql
- id (Primary Key)
- user_id (Foreign Key → CustomUser)
- stream_name (Text, default: "New Chat")
- stream_summary (Text, default: "")
- status (Char, default: "active")
- created_at (DateTime, auto)
- ended_at (DateTime, nullable)
```

#### Chats
```sql
- id (Primary Key)
- chat_id (Foreign Key → ChatSession)
- role (Char: "user" | "assistant")
- content (Text)
- created_at (DateTime, auto)
```

### ChromaDB Collections

#### Document Structure
```python
{
    "page_content": "message content text",
    "metadata": {
        "user": "username",
        "chat_id": 1,
        "timestamp": "2024-01-15T10:30:00Z"
    }
}
```

#### Embedding Model
- Model: `all-MiniLM-L6-v2`
- Dimensions: 384
- Provider: Sentence Transformers

## Security

### Authentication Flow

```
1. User Registration
   │
   ├─► POST /api/auth/register/
   ├─► Validate credentials
   ├─► Hash password
   └─► Create user account

2. User Login
   │
   ├─► POST /api/auth/login/
   ├─► Authenticate credentials
   ├─► Generate JWT tokens
   │   ├─► Access Token (150 minutes)
   │   └─► Refresh Token (7 days)
   └─► Return tokens + user data

3. API Request
   │
   ├─► Include Access Token in Header
   │   Authorization: Bearer <token>
   ├─► Backend validates token
   ├─► Extract user from token
   └─► Process request

4. Token Refresh
   │
   ├─► POST /api/auth/token/
   ├─► Validate Refresh Token
   └─► Generate new Access Token
```

### CORS Configuration

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True
```

## Performance Considerations

### Vector Database Optimization

1. **Persistent Storage**: ChromaDB uses persistent directory to avoid rebuilding indexes
2. **Chunking Strategy**: 800 character chunks with 150 overlap balance context and search efficiency
3. **Retrieval**: Top k=8 documents provide sufficient context without overwhelming the prompt
4. **Embedding Model**: Lightweight model (all-MiniLM-L6-v2) balances speed and accuracy

### Database Optimization

1. **Indexes**: Foreign keys and frequently queried fields are indexed
2. **Query Optimization**: Efficient queries using Django ORM select_related and prefetch_related
3. **Background Processing**: Summarization runs in background threads to avoid blocking requests

### API Optimization

1. **JWT Tokens**: Stateless authentication reduces database queries
2. **Token Lifetime**: 150-minute access tokens balance security and user experience
3. **Error Handling**: Comprehensive error responses for debugging

## Deployment Architecture

### Docker Compose Setup

```
┌─────────────────────────────────────────┐
│         Docker Network                  │
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │   Frontend   │  │   Backend    │   │
│  │   Container  │  │   Container  │   │
│  │   Port 3000  │  │   Port 8000  │   │
│  └──────┬───────┘  └──────┬───────┘   │
│         │                 │            │
│         └────────┬────────┘            │
│                  │                     │
│         ┌────────┴────────┐           │
│         │                 │           │
│  ┌──────▼──────┐  ┌──────▼──────┐   │
│  │  PostgreSQL │  │   ChromaDB  │   │
│  │  Container  │  │  (Volume)   │   │
│  │  Port 5432  │  │             │   │
│  └─────────────┘  └─────────────┘   │
└───────────────────────────────────────┘
```

### Environment Variables

- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password
- `GEMINI_API_KEY`: Google Gemini API key
- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode flag

## Technology Stack Details

### Backend Stack

- **Django 5.0+**: Web framework
- **Django REST Framework**: API framework
- **djangorestframework-simplejwt**: JWT authentication
- **django-cors-headers**: CORS handling
- **psycopg2-binary**: PostgreSQL adapter
- **google-generativeai**: Gemini API client
- **langchain**: LLM framework
- **langchain-community**: Community integrations
- **chromadb**: Vector database
- **sentence-transformers**: Embedding models

### Frontend Stack

- **React 19**: UI library
- **React Router DOM 7**: Routing
- **Tailwind CSS 4**: Styling
- **Vite 7**: Build tool
- **React Markdown**: Markdown rendering
- **Lucide React**: Icons

### Infrastructure

- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **PostgreSQL 15**: Relational database
- **ChromaDB**: Vector database
- **Google Gemini API**: AI model service

