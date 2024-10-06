from matplotlib.axes import Axes
from matplotlib.figure import Figure
import matplotlib.dates as mdates
import pandas as pd


def generate_predictions_graph(latest_data: pd.DataFrame, predictions: tuple[list[float], list[float]]) -> Figure:
    latest_price = latest_data[latest_data['Date'] == latest_data['Date'].max()]['Soybean_price_USD_ton']
    future_values = [latest_price.iloc[0]] + predictions[1]

    fig = Figure()
    ax = fig.subplots()

    future_dates = predictions[0]
    furthest_prediction_date = max(future_dates)
    ax.set_xlim(latest_data['Date'].min(), furthest_prediction_date)

    ax.plot(latest_data['Date'], latest_data['Soybean_price_USD_ton'], label='Latest prices', color='green')
    ax.plot(future_dates, future_values, label='Future prediction', linestyle='--', color='green')

    add_prediction_graph_labels(ax)
    fig.subplots_adjust(bottom=0.2)
    
    return fig



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

