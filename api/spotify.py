import json
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os
import time

SCOPE = 'user-read-playback-state user-modify-playback-state'
all_vinyl_positions = json.load(open("all_vinyl_positions.json"))

def get_auth_url():
    auth_manager = SpotifyOAuth(
        client_id=os.getenv("SPOTIPY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
        redirect_uri=os.getenv("SPOTIPY_REDIRECT_URI"),
        scope=SCOPE
    )
    return auth_manager.get_authorize_url()

def get_spotify_client():

    # Initialize the SpotifyOAuth with cache_path set to None to disable the .cache file
    auth_manager = SpotifyOAuth(
        client_id=os.getenv("SPOTIPY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
        redirect_uri=os.getenv("SPOTIPY_REDIRECT_URI"),
        scope="user-read-playback-state user-modify-playback-state",
        cache_path=None  # Disable the use of the .cache file
    )

    # Load token info from environment variables
    token_info = {
        "access_token": os.getenv("SPOTIFY_ACCESS_TOKEN"),
        "refresh_token": os.getenv("SPOTIFY_REFRESH_TOKEN"),
        "expires_at": int(os.getenv("SPOTIFY_TOKEN_EXPIRES_AT", "0"))
    }

    # auth_code = "insert_manual_auth_code"
    # if auth_code:
    #     token_info = auth_manager.get_access_token(auth_code)
        
    #     print("Token Information (MANUALLY PASTE IN .ENV):")
    #     print(token_info)

    # if not token_info['refresh_token']:
    #     authorization_url = auth_manager.get_authorize_url()
    #     print("authorization_url: ", authorization_url)
    #     return authorization_url

    # Check if the token is expired and refresh it if necessary
    if token_info['expires_at'] <= int(time.time()):
        if not token_info['refresh_token']:
            raise Exception("Refresh token is missing. Please reauthorize the application.")

        try:
            # Refresh the token using the refresh token
            token_info = auth_manager.refresh_access_token(token_info['refresh_token'])

            # Update environment variables with the new token info
            os.environ["SPOTIFY_ACCESS_TOKEN"] = token_info["access_token"]
            os.environ["SPOTIFY_REFRESH_TOKEN"] = token_info["refresh_token"]
            os.environ["SPOTIFY_TOKEN_EXPIRES_AT"] = str(token_info["expires_at"])

        except spotipy.oauth2.SpotifyOauthError as e:
            print(f"Error refreshing access token: {e}")
            raise Exception("Failed to refresh access token. Please reauthorize the application.")

    return spotipy.Spotify(auth_manager=auth_manager)



def get_active_spotify_devices():
    sp = get_spotify_client()
    devices = sp.devices()
    return devices['devices'] if devices and 'devices' in devices else []


def get_album_info(position):
    sp = get_spotify_client()

    album_url = next((a["spotify_url"] for a in all_vinyl_positions if a["position"] == position), None)
    if not album_url:
        return None
    
    album_id = album_url.split("/")[-1].split("?")[0]
    album_info = _filter_album_info(sp.album(album_id))

    return album_info


def _filter_album_info(album_raw):
    return {
        "id": album_raw["id"],
        "name": album_raw["name"],
        "artists": [artist["name"] for artist in album_raw["artists"]],
        "release_date": album_raw["release_date"],
        "total_tracks": album_raw["total_tracks"],
        "image": album_raw["images"][0],
        "total_duration_ms": sum(track["duration_ms"] for track in album_raw["tracks"]["items"]),
        "tracks": [
                {
                    "name": track["name"],
                    "id": track["id"],
                    "artists": [artist["name"] for artist in track["artists"]],
                    "duration_ms": track["duration_ms"],
                }
                for track in album_raw["tracks"]["items"]
            ]
    }


def play_album(album_id, device_id, shuffle=False):
    sp = get_spotify_client()
    sp.start_playback(device_id=device_id, context_uri=f"spotify:album:{album_id}")
    return
