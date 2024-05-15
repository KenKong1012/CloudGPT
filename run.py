import socket
import json
from openai import OpenAI
from flask import Flask, render_template, request

client = OpenAI(
    api_key='',
    base_url=""
)
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
]

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/post/ask-question', methods=['POST'])
def ask_question():
    if len(messages) > 50:
        del messages[1]
    
    print('Current Message Number:', len(messages))
    messages.append({"role": "user","content": request.data.decode('utf-8')})
    
    chat_completion = client.chat.completions.create(
        messages=messages,
        model="gpt-3.5-turbo",
    )
    response = chat_completion.choices[0].message.content
    messages.append({"role": "assistant", "content": response})
    return response

@app.route('/get/clear-session')
def clear_session():
    print('Clearing Session...')
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
    ]
    print('Message: ', len(messages))
    return 'True'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

