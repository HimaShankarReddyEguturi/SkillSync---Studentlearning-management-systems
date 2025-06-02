from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

GOOGLE_API_KEY = "AIzaSyD7bidYI974qdDL5hG0-ivQbSepCZO38Nw"
genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel('gemini-1.5-flash')
chat = model.start_chat(history=[])

app = Flask(__name__)
CORS(app)  # Allow all origins OR specify allowed origins: CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5500"}})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat_response():
    user_input = request.json.get('message')
    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    try:
        response_raw = chat.send_message(user_input)
        response = response_raw.text
        return jsonify({"response": response})
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
