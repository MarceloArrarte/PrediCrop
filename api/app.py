import base64
from io import BytesIO

from matplotlib.figure import Figure
from flask import Flask, request
from data_gateway import get_latest_data
from predictions import generate_predictions
from graphs import generate_predictions_graph

app = Flask(__name__)

@app.post("/make-prediction")
def make_prediction():
    body = request.json
    
    coordinates = (body.get('latitude'), body.get('longitude'))
    time_window = body.get('time_window')
    crop = body.get('crop')

    latest_data = get_latest_data(coordinates, time_window, crop)
    predictions =  generate_predictions(latest_data)
    graph = generate_predictions_graph(latest_data, predictions)

    return f"<img src='data:image/png;base64,{img2base64(graph)}'/>"


def img2base64(fig: Figure):
    buf = BytesIO()
    fig.savefig(buf, format="png")
    
    data = base64.b64encode(buf.getbuffer()).decode("ascii")
    return data