from openai import OpenAI
from PIL import Image, ImageGrab
import pytesseract
import numpy as np
import eel
from rembg import remove
import base64
from io import BytesIO

#pytesseract.pytesseract.tesseract_cmd = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
client = OpenAI(
        api_key='sk-36qNOsbIJyAHOFAEiYbgLZIWnOjduJFu0fcPyn4XRA2Ab4g0',
        base_url="https://api.chatanywhere.tech/v1"
        )

eel.init('web')

messages = [
    {"role": "system", "content": "You are a helpful assistant."},
]

@eel.expose
def get_gpt_response(question):
    if len(messages) > 50:
        del array[1]
    
    print('Current Message Number:', len(messages))

    messages.append({"role": "user","content": question})
    
    chat_completion = client.chat.completions.create(
        messages=messages,
        model="gpt-3.5-turbo",
    )
    
    response = chat_completion.choices[0].message.content
    messages.append({"role": "assistant", "content": response})

    return response

@eel.expose
def get_ocr_response():
    image = ImageGrab.grabclipboard()
    if image is None:
        response = "No image data found on the clipboard."
    else:
        img1 = np.array(image)
        response = pytesseract.image_to_string(img1)
    return response
    
@eel.expose
def clear_session():
    print('Clearing Session...')
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
    ]
    print('Message: ', len(messages))
    return True

@eel.expose
def remove_bg():
    print('Removing Images...')
    image = ImageGrab.grabclipboard()
    if image is None:
        response = "No image from clipboard"
    else:
        output = remove(image)
        buffered = BytesIO()
        output.save(buffered, format='PNG')
        response = base64.b64encode(buffered.getvalue())
    return response.decode('utf-8')

eel.start('index.html', mode='default')

