from datetime import timedelta
import datetime

import pandas as pd


def generate_predictions(latest_data: pd.DataFrame) -> datetime:
    return (
        [latest_data['Date'].max() + timedelta(days=i) for i in range(1, 6 * 30, 30)],
        [520, 507, 489, 483, 502]   # TODO: devolver aquí los valores de predicciones del modelo de ML
    )