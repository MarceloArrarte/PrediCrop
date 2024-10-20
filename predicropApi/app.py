from flask import Flask, request, jsonify
import joblib
from datetime import date
import pandas as pd
import numpy as np
from flask_cors import CORS
import os

allowed_origins = os.environ.get('ORIGIN_WHITELIST')
if allowed_origins == None or allowed_origins == '':
    print('Missing env var: ORIGIN_WHITELIST')

app = Flask(__name__)
CORS(app, origins=allowed_origins)

@app.get("/")
def say_hi():
    return 'Hello world!'


@app.post("/make-prediction")
def make_prediction():
    body = request.json
    days = body.get('days')
    """
    coordinates = (body.get('latitude'), body.get('longitude'))
    time_window = body.get('time_window')
    crop = body.get('crop')

    latest_data = get_latest_data(coordinates, time_window, crop)
    predictions =  generate_predictions(latest_data)
    imgTag = generate_predictions_image(latest_data, predictions)
    tableTag = generate_predictions_table(latest_data, predictions)

    return f'{imgTag}{tableTag}'
    """
    return jsonify({"predictions": predict_days(int(days)).tolist()})

@app.post("/forecast")
def get_temperature():
    body = request.json
    days = body.get('days')
    n = initial_time + days
    if n > 180:
        n = 180
    filtered_df = forecast_data[(forecast_data['time'] >= initial_time) & (
        forecast_data['time'] <= n)]
    
    return jsonify({"forecast":filtered_df[["precipitation","temp"]].to_dict()})


def init():
    global datos_120, datos_60, model, forecast_data, initial_time

    # datos_120= {'actual_lag_1': [1163.5], 'actual_lag_2': [1170.75], 'actual_lag_3': [1158.5], 'actual_lag_4': [1159.5], 'actual_lag_5': [1164.375], 'actual_lag_6': [1152.0], 'actual_lag_7': [1148.625], 'actual_lag_8': [1177.875], 'actual_lag_9': [1197.5], 'actual_lag_10': [1216.75], 'actual_lag_11': [1235.25], 'actual_lag_12': [1222.375], 'actual_lag_13': [1205.25], 'actual_lag_14': [1199.875], 'actual_lag_15': [0.0], 'actual_lag_16': [0.0], 'actual_lag_17': [1220.875], 'actual_lag_18': [1214.875], 'actual_lag_19': [1223.25], 'actual_lag_20': [1237.375], 'actual_lag_21': [1239.625], 'actual_lag_22': [1241.5], 'actual_lag_23': [1247.125], 'actual_lag_24': [1243.5], 'actual_lag_25': [1240.5], 'actual_lag_26': [1221.875], 'actual_lag_27': [1213.625], 'actual_lag_28': [1213.25], 'actual_lag_29': [1194.0], 'actual_lag_30': [1182.75], 'actual_lag_31': [1183.5], 'actual_lag_32': [1190.25], 'actual_lag_33': [1188.375], 'actual_lag_34': [1183.125], 'actual_lag_35': [1185.0], 'actual_lag_36': [1178.75], 'actual_lag_37': [1181.125], 'actual_lag_38': [1183.5], 'actual_lag_39': [1168.25], 'actual_lag_40': [1166.125], 'actual_lag_41': [1165.375], 'actual_lag_42': [1162.375], 'actual_lag_43': [1167.875], 'actual_lag_44': [1168.875], 'actual_lag_45': [1168.75], 'actual_lag_46': [1160.125], 'actual_lag_47': [1156.625], 'actual_lag_48': [1155.0], 'actual_lag_49': [1167.125], 'actual_lag_50': [1171.125], 'actual_lag_51': [1181.875], 'actual_lag_52': [1174.5], 'actual_lag_53': [1172.5], 'actual_lag_54': [1150.5], 'actual_lag_55': [1141.0], 'actual_lag_56': [0.0], 'actual_lag_57': [1088.375], 'actual_lag_58': [1086.625], 'actual_lag_59': [1096.25], 'actual_lag_60': [1095.0], 'actual_lag_61': [1101.375], 'actual_lag_62': [1110.125], 'actual_lag_63': [1120.0], 'actual_lag_64': [1113.875], 'actual_lag_65': [1112.0], 'actual_lag_66': [1094.375], 'actual_lag_67': [1052.25], 'actual_lag_68': [1041.375], 'actual_lag_69': [1034.5], 'actual_lag_70': [1026.75], 'actual_lag_71': [1025.25], 'actual_lag_72': [1033.25], 'actual_lag_73': [1033.5], 'actual_lag_74': [1020.25], 'actual_lag_75': [1016.625], 'actual_lag_76': [1021.125], 'actual_lag_77': [1029.375], 'actual_lag_78': [1002.5], 'actual_lag_79': [989.625], 'actual_lag_80': [955.75], 'actual_lag_81': [944.375], 'actual_lag_82': [947.75], 'actual_lag_83': [958.5], 'actual_lag_84': [960.75], 'actual_lag_85': [951.5], 'actual_lag_86': [947.625], 'actual_lag_87': [950.25], 'actual_lag_88': [964.375], 'actual_lag_89': [961.5], 'actual_lag_90': [966.0], 'actual_lag_91': [979.5], 'actual_lag_92': [993.125], 'actual_lag_93': [994.5], 'actual_lag_94': [999.5], 'actual_lag_95': [1005.125], 'actual_lag_96': [1000.125], 'actual_lag_97': [981.0], 'actual_lag_98': [978.25], 'actual_lag_99': [987.5], 'actual_lag_100': [0.0], 'actual_lag_101': [1005.5], 'actual_lag_102': [1006.5], 'actual_lag_103': [1014.125], 'actual_lag_104': [1012.5], 'actual_lag_105': [1010.125], 'actual_lag_106': [1026.875], 'actual_lag_107': [1045.5], 'actual_lag_108': [1042.875], 'actual_lag_109': [1052.25], 'actual_lag_110': [1051.875], 'actual_lag_111': [1060.875], 'actual_lag_112': [1055.25], 'actual_lag_113': [1053.125], 'actual_lag_114': [1049.0], 'actual_lag_115': [1045.75], 'actual_lag_116': [1032.75], 'actual_lag_117': [1025.5], 'actual_lag_118': [1019.375], 'actual_lag_119': [1018.625], 'actual_lag_120': [1013.875]}
    datos_60 = {'actual_lag_1': [1101.375], 'actual_lag_2': [1110.125], 'actual_lag_3': [1120.0], 'actual_lag_4': [1113.875], 'actual_lag_5': [1112.0], 'actual_lag_6': [1094.375], 'actual_lag_7': [1052.25], 'actual_lag_8': [1041.375], 'actual_lag_9': [1034.5], 'actual_lag_10': [1026.75], 'actual_lag_11': [1025.25], 'actual_lag_12': [1033.25], 'actual_lag_13': [1033.5], 'actual_lag_14': [1020.25], 'actual_lag_15': [1016.625], 'actual_lag_16': [1021.125], 'actual_lag_17': [1029.375], 'actual_lag_18': [1002.5], 'actual_lag_19': [989.625], 'actual_lag_20': [955.75], 'actual_lag_21': [944.375], 'actual_lag_22': [947.75], 'actual_lag_23': [958.5], 'actual_lag_24': [960.75], 'actual_lag_25': [951.5], 'actual_lag_26': [947.625], 'actual_lag_27': [950.25], 'actual_lag_28': [964.375], 'actual_lag_29': [961.5], 'actual_lag_30': [
        966.0], 'actual_lag_31': [979.5], 'actual_lag_32': [993.125], 'actual_lag_33': [994.5], 'actual_lag_34': [999.5], 'actual_lag_35': [1005.125], 'actual_lag_36': [1000.125], 'actual_lag_37': [981.0], 'actual_lag_38': [978.25], 'actual_lag_39': [987.5], 'actual_lag_40': [0.0], 'actual_lag_41': [1005.5], 'actual_lag_42': [1006.5], 'actual_lag_43': [1014.125], 'actual_lag_44': [1012.5], 'actual_lag_45': [1010.125], 'actual_lag_46': [1026.875], 'actual_lag_47': [1045.5], 'actual_lag_48': [1042.875], 'actual_lag_49': [1052.25], 'actual_lag_50': [1051.875], 'actual_lag_51': [1060.875], 'actual_lag_52': [1055.25], 'actual_lag_53': [1053.125], 'actual_lag_54': [1049.0], 'actual_lag_55': [1045.75], 'actual_lag_56': [1032.75], 'actual_lag_57': [1025.5], 'actual_lag_58': [1019.375], 'actual_lag_59': [1018.625], 'actual_lag_60': [1013.875]}
    model = joblib.load('./models/XGBoost.joblib')

    # Tiempo inicial tomando como base es el 2024-08-01
    initial_time = (date.today() - date(2024, 8, 1)).days

    forecast_data = pd.read_csv("datasets/pronostico_temp_prec.csv")


def run_many(new_data):
    global datos_60
    # Junta los datos de entrada con los precios de soja de los últimos 12
    n = len(new_data["precipitation"])
    datos = datos_60
    for key in datos:
        value = datos[key][0]
        datos[key] = [value] * n

    arr = np.transpose(list((new_data | datos).values()))
    return model.predict(arr)


def predict_days(days):
    global forecast_data, initial_time
    # Days: cantidad de días a partir de hoy que se quiere predecir
    # Dia inicial del prónostico es del 2024-08-01
    datos = {}
    n = initial_time + days
    if n > 180:
        n = 180
    filtered_df = forecast_data[(forecast_data['time'] >= initial_time) & (
        forecast_data['time'] <= n)]
    datos["precipitation"] = filtered_df["precipitation"].to_list()
    datos["temp"] = filtered_df["temp"].to_list()
    datos["moisture"] = [80] * (len(datos["precipitation"]))
    # REVISAR EL VALOR DE LA HUMEDAD! es el promedio de humedad del piso
    datos["actual"] = [1013] * (len(datos["precipitation"]))
    # se podria consultar una api, pero como no hay F.
    return run_many(datos)


init()
