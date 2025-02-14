from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

@app.route('/api/message', methods=['POST'])
def handle_message():
    data = request.json
    user_message = data.get('message', '')
    # Process the message and generate a response
    response = {"reply": f"You said: {user_message}"}
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
