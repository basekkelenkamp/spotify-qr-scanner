from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from pydantic import BaseModel

from api.spotify import get_active_spotify_devices, get_album_info, play_album, play_track, queue_album
from api.spotify import all_vinyl_positions
load_dotenv()
app = FastAPI()

class Album(BaseModel):
    album_id: str
    shuffle: bool = False

class Track(BaseModel):
    track_id: str

@app.get("/api/vinyls/{position}")
async def get_vinyl_position(position):
    return {"vinyl_position": position}


@app.post("/api/play/album/{position}")
async def album_play(position: int, album: Album):
    try:
        pos_id = next((a["spotify_url"] for a in all_vinyl_positions if a["position"] == position), None).split("/")[-1].split("?")[0]
        if pos_id != album.album_id:
            raise HTTPException(status_code=400, detail="Album ID does not match the position")

        devices = get_active_spotify_devices()
        print("Active Devices:", devices)

        if not devices:
            raise HTTPException(status_code=404, detail="No active Spotify devices found.")

        play_album(album.album_id, devices[0]['id'], album.shuffle)
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"status": "Playing album on Spotify"}


@app.post("/api/queue/album/{position}")
async def album_queue(position: int, album: Album):
    try:
        pos_id = next((a["spotify_url"] for a in all_vinyl_positions if a["position"] == position), None).split("/")[-1].split("?")[0]
        if pos_id != album.album_id:
            raise HTTPException(status_code=400, detail="Album ID does not match the position")

        devices = get_active_spotify_devices()
        print("Active Devices:", devices)

        if not devices:
            raise HTTPException(status_code=404, detail="No active Spotify devices found.")

        queue_album(album.album_id, devices[0]['id'])
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"status": "Queued album on Spotify"}


@app.post("/api/play/track/{position}")
async def track_play(position: int, track: Track):
    try:
        album_info = get_album_info(position)
        if track.track_id not in [t["id"] for t in album_info["tracks"]]:
            raise HTTPException(status_code=400, detail="Track ID not found in album")

        devices = get_active_spotify_devices()
        print("Active Devices:", devices)

        if not devices:
            raise HTTPException(status_code=404, detail="No active Spotify devices found.")

        play_track(track.track_id, devices[0]['id'])
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"status": "Playing track on Spotify"}


@app.get("/api/album/{position}")
async def get_album(position: int):
    album_info = get_album_info(position)

    if not album_info:
        raise HTTPException(status_code=404, detail="Album not found at position")
    
    print("album info:\n", album_info)
    return album_info




# @app.get("/api/callback/")
# async def callback(request: Request):
#     auth_code = request.query_params.get('code')
#     if not auth_code:
#         raise HTTPException(status_code=400, detail="No authorization code provided")
    
#     # Exchange the authorization code for tokens
#     sp = get_spotify_client(auth_code=auth_code)
    
#     # Print out the token information
#     token_info = {
#         "access_token": os.getenv("SPOTIFY_ACCESS_TOKEN"),
#         "refresh_token": os.getenv("SPOTIFY_REFRESH_TOKEN"),
#         "expires_at": os.getenv("SPOTIFY_TOKEN_EXPIRES_AT")
#     }

#     print("Token Information:")
#     print(f"Access Token: {token_info['access_token']}")
#     print(f"Refresh Token: {token_info['refresh_token']}")
#     print(f"Expires At (Timestamp): {token_info['expires_at']}")
    
#     return {
#         "status": "Authorization successful, token stored",
#         "token_info": token_info
#     }
