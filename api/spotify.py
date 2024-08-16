import json
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os
import time
from dotenv import load_dotenv

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
    token_info = {
        "access_token": os.getenv("SPOTIFY_ACCESS_TOKEN"),
        "refresh_token": os.getenv("SPOTIFY_REFRESH_TOKEN"),
        "expires_at": int(os.getenv("SPOTIFY_TOKEN_EXPIRES_AT", "0"))
    }

    auth_manager = SpotifyOAuth(
        client_id=os.getenv("SPOTIPY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
        redirect_uri=os.getenv("SPOTIPY_REDIRECT_URI"),
        scope="user-read-playback-state user-modify-playback-state",
    )

    # auth_code = "insert_manual_auth_code"
    # if auth_code:
    #     token_info = auth_manager.get_access_token(auth_code)
        
    #     print("Token Information (MANUALLY PASTE IN .ENV):")
    #     print(token_info)

    # if not token_info['refresh_token']:
    #     authorization_url = auth_manager.get_authorize_url()
    #     print("authorization_url: ", authorization_url)
    #     return authorization_url

    if not token_info['access_token'] or token_info['expires_at'] <= int(time.time()):
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

    # Directly create the Spotify client with the access token
    sp = spotipy.Spotify(auth=token_info['access_token'])

    return sp


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
    print("shuffle:", shuffle)
    sp = get_spotify_client()
    sp.shuffle(state=shuffle)
    sp.start_playback(device_id=device_id, context_uri=f"spotify:album:{album_id}")
    return

def play_track(track_id, device_id):
    sp = get_spotify_client()
    print(f"Playing track: {track_id}")
    sp.start_playback(device_id=device_id, uris=[f"spotify:track:{track_id}"])
    return


def queue_album(album_id, device_id=None):
    sp = get_spotify_client()
    album_tracks = sp.album_tracks(album_id)['items']
    
    for track in album_tracks:
        track_uri = track['uri']
        print(f"Queuing track: {track['name']} ({track_uri})")
        sp.add_to_queue(track_uri, device_id=device_id)
    
    return
