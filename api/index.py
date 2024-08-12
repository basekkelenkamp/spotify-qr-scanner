from fastapi import FastAPI
from dotenv import load_dotenv
from time import sleep

load_dotenv()
app = FastAPI()

@app.get("/api/vinyls/{position}")
async def get_vinyl_position(position):
    return {"vinyl_position": position}


@app.post("/api/play/{position}")
async def play(position):
    sleep(1)
    return {"play": position}


@app.post("/api/shuffle/{position}")
async def play_shuffle(position):
    sleep(0.5)
    return {"shuffle": position}
