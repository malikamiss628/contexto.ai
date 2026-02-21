import os
import requests
from google import genai
from google.genai import types
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, inspect

# ==========================================
# 1. API SETUP & AI CONFIGURATION
# ==========================================
app = FastAPI(title="CONTEXTO AI Backend")

# Allow your local HTML file to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace "*" with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Google Gemini API (Get a free key from Google AI Studio)
# Set your key as an environment variable: export GEMINI_API_KEY="your_key"
API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyAxsSbgg7kFQsSfETn-QxBtPAPfyQuP98I") 
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# ==========================================
# 2. DATA MODELS (Pydantic)
# ==========================================
class ChatRequest(BaseModel):
    message: str
    context: str = ""

class DatasetRequest(BaseModel):
    url: str

# ==========================================
# 3. ENDPOINTS
# ==========================================

@app.get("/api/schema/extract")
def extract_database_schema(db_url: str = "sqlite:///:memory:"):
    """
    Connects to a database (PostgreSQL, Snowflake, etc.), extracts tables and columns,
    and asks Gemini to write a business summary for each table.
    """
    try:
        # 1. Connect to Database (Using SQLite as a safe default for the demo)
        engine = create_engine(db_url)
        inspector = inspect(engine)
        
        schema_data = []
        for table_name in inspector.get_table_names():
            columns = [col['name'] for col in inspector.get_columns(table_name)]
            
            # 2. Use AI to generate a business summary based on column names
            prompt = f"Write a 2-sentence business description for a database table named '{table_name}' containing these columns: {', '.join(columns)}."
            response = model.generate_content(prompt)
            
            schema_data.append({
                "name": table_name,
                "columns": columns,
                "summary": response.text.strip(),
                "stats": {"completeness": "99%", "freshness": "Just now", "uniqueness": "100%"},
                "chartData": [100, 150, 130, 200, 250, 210, 300] # Mock distribution data
            })
            
        return {"status": "success", "data": schema_data}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/dataset/parse")
def parse_markdown_dataset(req: DatasetRequest):
    """
    Fetches the HackFest Markdown dataset from GitHub and uses Gemini to 
    parse the unstructured text into a structured JSON schema.
    """
    try:
        # 1. Fetch the raw markdown content
        response = requests.get(req.url)
        if response.status_code != 200:
            raise Exception("Failed to fetch dataset from GitHub")
        
        markdown_text = response.text
        
        # 2. Instruct Gemini to act as a data dictionary agent
        prompt = f"""
        You are an intelligent data dictionary agent. Read the following hackathon dataset document.
        Extract the implicit database tables, columns, and business logic into a valid JSON array.
        Follow this exact JSON structure:
        [
            {{
                "name": "table_name_extracted",
                "summary": "AI generated summary of what this data is for based on the doc",
                "stats": {{"completeness": "100%", "freshness": "Just now", "uniqueness": "99%"}},
                "chartData": [500, 600, 550, 700, 850, 800, 1000]
            }}
        ]
        
        Document Content:
        {markdown_text[:8000]} # Limiting chars to avoid token limits for demo
        """
        
        # Force JSON response from Gemini
        ai_response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        
        return {"status": "success", "data": ai_response.text}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
def ai_chat_assistant(req: ChatRequest):
    """
    Handles natural language queries from the user about their data.
    """
    try:
        system_prompt = "You are a helpful AI Database Architect. Keep your answers brief, technical, and directly answer the user's question."
        full_prompt = f"{system_prompt}\n\nContext (Current Database Schema): {req.context}\n\nUser Question: {req.message}"
        
        response = model.generate_content(full_prompt)
        return {"status": "success", "reply": response.text}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run server if executed directly
if __name__ == "__main__":
    import uvicorn
    print("Starting Nexus Data AI Backend on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)