from fastapi import FastAPI
from dotenv import load_dotenv


load_dotenv()
app = FastAPI()

@app.get("/api/python")
async def hello_world():
    return {"hello": "world"}
