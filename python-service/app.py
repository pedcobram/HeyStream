from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pytchat
import os
import re

port = int(os.environ.get("PORT", 5000))

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/youtube/chat/{videoId}/{startAt}/{stopAt}") 
async def get(videoId: str, startAt: int, stopAt: str):
    messages = []
    chat = pytchat.create(videoId, seektime = startAt) #
    while chat.is_alive():
        data = chat.get()
        for c in data.items:
            message = f"{c.elapsedTime}-{c.message}"
            messages.append(message)
            if stopAt.replace("_", ":") in message:
                return messages

    
