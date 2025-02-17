from flask import Flask, request, jsonify
from flask_cors import CORS  # Enables Cross-Origin Resource Sharing

app = Flask(__name__)
CORS(app)  # Allow frontend to make requests

chat_history = []  # Store chat messages in-memory (replace with database later)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    # Dummy AI Response (Replace with real logic)
    ai_response = f"Hello! You said: {user_message}"

    # Save to history
    chat_history.append({"id": len(chat_history) + 1, "text": user_message, "is_user": True})
    chat_history.append({"id": len(chat_history) + 1, "text": ai_response, "is_user": False})

    return jsonify({"response": ai_response})

@app.route('/chat/history', methods=['GET'])
def get_chat_history():
    return jsonify(chat_history)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
