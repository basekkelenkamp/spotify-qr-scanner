import json
import base64
import os
from fastapi import HTTPException
import requests

REPO = "basekkelenkamp/spotify-qr-scanner"
PATH = "all_vinyl_positions.json"
BRANCH = "main"
TOKEN = os.getenv("GITHUB_TOKEN")

def get_github_file_sha():
    url = f"https://api.github.com/repos/{REPO}/contents/{PATH}?ref={BRANCH}"
    headers = {"Authorization": f"token {TOKEN}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()["sha"]
    else:
        raise HTTPException(status_code=response.status_code, detail="Failed to retrieve file SHA.")

def update_github_file(content, sha, message):
    url = f"https://api.github.com/repos/{REPO}/contents/{PATH}"
    headers = {"Authorization": f"token {TOKEN}"}
    data = {
        "message": message,
        "content": base64.b64encode(content.encode()).decode(),
        "sha": sha,
        "branch": BRANCH,
    }
    response = requests.put(url, headers=headers, data=json.dumps(data))
    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(status_code=response.status_code, detail="Failed to update file on GitHub.")
