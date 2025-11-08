import os
import google.generativeai as genai
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings

# from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_text_splitters import RecursiveCharacterTextSplitter

from langchain_core.documents import Document

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


def build_or_load_vectordb(chat_data, persist_dir="chroma_db"):
    embedding_model = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

    # Load existing DB if present
    if os.path.exists(persist_dir):
        vectordb = Chroma(
            persist_directory=persist_dir, embedding_function=embedding_model
        )
    else:
        documents = [
            Document(
                page_content=chat.content,
                metadata={
                    "user": chat.chat.user.username,
                    "chat_id": chat.chat.id,
                    "timestamp": str(chat.created_at),
                },
            )
            for chat in chat_data
        ]
        splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=150)
        chunks = splitter.split_documents(documents)
        vectordb = Chroma.from_documents(
            chunks, embedding=embedding_model, persist_directory=persist_dir
        )
        vectordb.persist()

    return vectordb


def ragbot(chat_data, question):
    vectordb = build_or_load_vectordb(chat_data)
    retriever = vectordb.as_retriever(search_kwargs={"k": 8})

    related_docs = retriever.invoke(question)
    context = "\n\n".join([doc.page_content for doc in related_docs])
    # print("RAG Context:", context)

    # model = genai.GenerativeModel("models/gemini-2.5-flash")
    # response = model.generate_content(prompt, generation_config={"temperature": 0.2})
    return context  # response.text.strip()


def summarize_chat(chat_data):
    """Summarize the entire chat history using Gemini."""
    # Combine chat messages into one long string
    chat_text = "\n".join(
        [f"{chat.chat.user.username}: {chat.content}" for chat in chat_data]
    )

    # Split into manageable chunks for large conversations
    splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=300)
    chunks = splitter.split_text(chat_text)

    model = genai.GenerativeModel("models/gemini-2.5-flash")

    summaries = []
    for i, chunk in enumerate(chunks):
        prompt = f"Summarize the following part of a chat conversation:\n\n{chunk}"
        response = model.generate_content(prompt)
        summaries.append(response.text.strip())

    # Merge all partial summaries into a final overall summary
    final_prompt = (
        "Combine the following partial summaries into a coherent overall summary:\n\n"
        + "\n\n".join(summaries)
    )
    final_summary = model.generate_content(final_prompt).text.strip()

    return final_summary
