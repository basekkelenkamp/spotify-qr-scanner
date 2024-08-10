from fastapi import FastAPI
from dotenv import load_dotenv
import os
from pprint import pprint


load_dotenv()
app = FastAPI()

@app.get("/api/python")
def hello_world():
    return {"tracks": ""}
