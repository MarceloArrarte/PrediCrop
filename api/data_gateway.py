from typing import TypedDict
import pandas as pd
from datetime import datetime, timedelta
from enum import Enum

class Location(TypedDict):
    latitude: float
    longitude: float

class TimeWindow(Enum):
    ONE_MONTH = "30d"
    THREE_MONTHS = "90d"
    SIX_MONTHS = "180d"

class Crop(Enum):
    SOYBEAN = "soybean"


df_soja: pd.DataFrame = None

def load_data():
    global df_soja

    # Leer el archivo CSV
    df_soja = pd.read_csv('datasets/soybean_price_history.csv')

    # Convertir la columna 'Fecha' a tipo datetime
    df_soja['Date'] = pd.to_datetime(df_soja['Date'])


def get_latest_data(coordinates: Location, time_window: TimeWindow, crop: Crop) -> pd.DataFrame:
    # TODO: obtener los datos de las distintas fuentes a partir de los parámetros
    return df_soja[df_soja['Date'] > datetime.now() - timedelta(days=6 * 30)]


load_data()