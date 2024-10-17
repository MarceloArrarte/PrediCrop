import base64
from io import BytesIO
from matplotlib.axes import Axes
from matplotlib.figure import Figure
import matplotlib.dates as mdates
import pandas as pd


def get_latest_row(data: pd.DataFrame) -> float:
    return data[data['Date'] == data['Date'].max()]


def generate_predictions_image(latest_data: pd.DataFrame, predictions: tuple[list[float], list[float]]) -> str:
    latest_price = get_latest_row(latest_data)['Soybean_price_USD_ton'].iloc[0]
    future_values = [latest_price] + predictions[1]

    fig = Figure()
    ax = fig.subplots()

    future_dates = predictions[0]
    furthest_prediction_date = max(future_dates)
    ax.set_xlim(latest_data['Date'].min(), furthest_prediction_date)

    ax.plot(latest_data['Date'], latest_data['Soybean_price_USD_ton'], label='Latest prices', color='green')
    ax.plot(future_dates, future_values, label='Future prediction', linestyle='--', color='green')

    add_prediction_graph_labels(ax)
    fig.subplots_adjust(bottom=0.2)
    
    return f"<img src='data:image/png;base64,{img2base64(fig)}'/>"


def add_prediction_graph_labels(ax: Axes) -> None:
    # Set x-ticks and rotate labels
    for label in ax.get_xticklabels():
        label.set_rotation(45)
        label.set_ha('center')

    ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
    ax.xaxis.set_major_locator(mdates.MonthLocator(interval=1))  # Set major ticks to every month

    ax.set_xlabel('Date')
    ax.set_ylabel('Price (USD/ton)')
    ax.set_title('Soybean price history')
    ax.grid(True)
    ax.legend()



def img2base64(fig: Figure):
    buf = BytesIO()
    fig.savefig(buf, format="png")
    
    data = base64.b64encode(buf.getbuffer()).decode("ascii")
    return data


def generate_predictions_table(latest_data: pd.DataFrame, predictions: tuple[list[float], list[float]]) -> str:
    latest_row = get_latest_row(latest_data)
    (dates, prices) = predictions

    table_html = "<table border='1'>"
    table_html += "<tr><th>Date</th><th>Price (USD/ton)</th></tr>"
    
    for date, price, i in zip(
        [None] + dates,
        [None] + prices,
        range(0, len(dates) + 1)
    ):
        if i == 0:
            currentDate = latest_row['Date'].iloc[0]
            currentPrice = latest_row['Soybean_price_USD_ton'].iloc[0]
            table_html += f"<tr><td>{currentDate.strftime('%Y-%m-%d')}</td><td>{currentPrice:.2f}</td></tr>"
        else:
            table_html += f"<tr><td>{date.strftime('%Y-%m-%d')}</td><td>{price:.2f}</td></tr>"

    table_html += "</table>"
    return table_html