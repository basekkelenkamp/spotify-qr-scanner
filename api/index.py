from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

from api.qr_helper_functions import get_qr_code_files


load_dotenv()
app = FastAPI()
app.mount("/static", StaticFiles(directory="qr_codes"), name="static")

@app.get("/api/vinyls/{position}")
async def get_vinyl_position(position):
    return {"vinyl_position": position}


@app.get("/api/qr_codes/")
async def get_qr_codes():
    qr_code_files = get_qr_code_files()
    urls = [f"/static/{file_name}" for file_name in qr_code_files]
    return {"qr_codes": urls}

@app.get("/api/qr_codes/{position}")
async def get_qr_code(position: int):
    qr_code_files = get_qr_code_files()
    if position < 1 or position > len(qr_code_files):
        raise HTTPException(status_code=404, detail="QR code not found")
    file_name = qr_code_files[position - 1]
    file_url = f"/static/{file_name}"
    return {"qr_code": file_url}
