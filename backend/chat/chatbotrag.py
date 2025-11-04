import os
import google.generativeai as genai
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Load API key from .env
# Initialize Gemini

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


# # Step 1: Load and chunk your document
# pdf_path = "dino2.pdf"  # <- change to your actual PDF
# loader = PyPDFLoader(pdf_path)
documents = "chat text goes here"

splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=150)
chunks = splitter.split_documents(documents)

# Step 2: Create embeddings and vector store
embedding_model = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vectordb = Chroma.from_documents(
    documents=chunks, embedding=embedding_model, persist_directory="chroma_db"
)
retriever = vectordb.as_retriever()


# Step 3: Ask a question and fetch relevant context
def ask_gemini(question: str):
    related_docs = retriever.get_relevant_documents(question, k=9)
    context = "\n\n".join([doc.page_content for doc in related_docs])
    print("\n\n\n\nthis is the data \n\n\n", context)

    prompt = f"""
You are a helpful assistant. Use ONLY the context below to answer the question.
If the answer is not in the context, say "I don't know."

Context:
{context}

Question:
{question}
"""

    # model = genai.GenerativeModel("gemini-pro")
    model = genai.GenerativeModel(model_name="models/gemini-2.5-flash")

    response = model.generate_content(prompt)
    return response.text.strip()


# Step 4: Example question loop
if __name__ == "__main__":
    print("📘 Gemini Chatbot (Document-Based)")
    print("Ask anything about your document. Type 'exit' to quit.\n")

    while True:
        q = input("❓ Question: ")
        if q.lower() in ("exit", "quit"):
            break
        answer = ask_gemini(q)
        print("🤖 Answer:", answer)
