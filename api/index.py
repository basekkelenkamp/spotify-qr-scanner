from fastapi import FastAPI
from dotenv import load_dotenv


load_dotenv()
app = FastAPI()

@app.get("/api/vinyls/{position}")
async def get_vinyl_position(position):
    return {"vinyl_position": position}
