import base64
from io import BytesIO

from matplotlib.figure import Figure
from flask import Flask, request
from data_gateway import get_latest_data
from predictions import generate_predictions
from visualization import generate_predictions_image, generate_predictions_table

app = Flask(__name__)

@app.post("/make-prediction")
def make_prediction():
    body = request.json
    
    coordinates = (body.get('latitude'), body.get('longitude'))
    time_window = body.get('time_window')
    crop = body.get('crop')

    latest_data = get_latest_data(coordinates, time_window, crop)
    predictions =  generate_predictions(latest_data)
    imgTag = generate_predictions_image(latest_data, predictions)
    tableTag = generate_predictions_table(latest_data, predictions)

    return f'{imgTag}{tableTag}'


