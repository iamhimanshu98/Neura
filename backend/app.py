import os
import requests
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")
API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Ensure API key exists
if not API_KEY:
    raise ValueError("Missing API key. Please set OPENROUTER_API_KEY in .env file.")

app = Flask(__name__)
CORS(app)  # Allow frontend requests

chat_history = []  # In-memory chat history

def chat_with_bot(user_input):
    global chat_history  

    # Add user input to chat history
    chat_history.append({"role": "user", "content": user_input})

    # Prepare request payload
    payload = {
        "model": "meta-llama/llama-3-8b-instruct",
        "messages": chat_history
    }

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(API_URL, json=payload, headers=headers)

    if response.status_code == 200:
        data = response.json()
        assistant_reply = data["choices"][0]["message"]["content"]

        chat_history.append({"role": "assistant", "content": assistant_reply})

        return assistant_reply
    else:
        return f"Error: {response.json()}"

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"response": "Please enter a message."})

    ai_response = chat_with_bot(user_message)

    return jsonify({"response": ai_response})

@app.route('/chat/history', methods=['GET'])
def get_chat_history():
    return jsonify(chat_history)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
