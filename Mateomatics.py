import requests
from datetime import datetime, timedelta
import pandas as pd
import matplotlib.pyplot as plt
from io import StringIO

class MeteomaticsClient:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.base_url = 'https://api.meteomatics.com'

    def get_precipitation_data(self, lat, lon, start_date, end_date):
        """
        Obtiene datos de precipitación para un período específico.
        """
        # Probemos con un parámetro diferente para verificar si obtenemos valores no nulos
        parameters = 'precip_24h:mm'  # Cambiamos a precipitación diaria

        format_start = datetime.strptime(start_date, '%Y-%m-%d').strftime('%Y-%m-%dT00:00:00Z')
        format_end = datetime.strptime(end_date, '%Y-%m-%d').strftime('%Y-%m-%dT00:00:00Z')

        time_string = f"{format_start}--{format_end}:P1D"  # Cambiamos a intervalo diario
        coordinates = f"{lat},{lon}"

        url = f"{self.base_url}/{time_string}/{parameters}/{coordinates}/csv"

        print(f"URL de la solicitud: {url}")

        try:
            response = requests.get(url, auth=(self.username, self.password))
            print(f"Código de estado: {response.status_code}")

            if response.status_code == 401:
                raise Exception("Error de autenticación. Verifica tus credenciales.")
            elif response.status_code != 200:
                print(f"Contenido de la respuesta: {response.text}")
                raise Exception(f"Error en la solicitud. Código de estado: {response.status_code}")

            # Usar punto y coma como separador
            data = pd.read_csv(StringIO(response.text), sep=';', skiprows=1)

            # Renombrar columnas
            data.columns = ['date', 'precipitation']

            # Convertir la columna de fecha a datetime
            data['date'] = pd.to_datetime(data['date'])

            # Convertir precipitation a números, reemplazando posibles errores con NaN
            data['precipitation'] = pd.to_numeric(data['precipitation'], errors='coerce')

            print("\nEstadísticas de precipitación:")
            print(data['precipitation'].describe())

            return data

        except Exception as e:
            print(f"Error al procesar los datos: {e}")
            print("Contenido de la respuesta:")
            print(response.text[:500])
            raise

    def analyze_extremes(self, data, drought_threshold=1.0, flood_threshold=50.0):
        drought_periods = data[data['precipitation'] < drought_threshold]
        flood_periods = data[data['precipitation'] > flood_threshold]

        return {
            'drought_periods': drought_periods,
            'flood_periods': flood_periods
        }

    def plot_precipitation_data(self, data):
        plt.figure(figsize=(15, 6))
        plt.plot(data['date'], data['precipitation'])
        plt.title('Precipitación Diaria')
        plt.xlabel('Fecha')
        plt.ylabel('Precipitación (mm)')
        plt.grid(True)
        plt.show()

def main():
    username = 'correa_florencia'
    password = 'u2Dn02L9Gw'
    client = MeteomaticsClient(username, password)

    lat, lon = 40.4168, -3.7038  # Madrid, España

    # Fechas
    start_date = '2024-05-12'
    end_date = '2024-10-11'

    try:
        print("Iniciando solicitud de datos...")
        data = client.get_precipitation_data(lat, lon, start_date, end_date)

        print("\nDatos procesados exitosamente. Primeras filas:")
        print(data.head())

        non_zero_days = data[data['precipitation'] > 0]
        print(f"\nDías con precipitación > 0: {len(non_zero_days)}")
        if len(non_zero_days) > 0:
            print("Ejemplos de días con precipitación:")
            print(non_zero_days.head())

        extremes = client.analyze_extremes(data)
        print(f"\nPeríodos de sequía encontrados: {len(extremes['drought_periods'])}")
        print(f"Períodos de inundación encontrados: {len(extremes['flood_periods'])}")

        client.plot_precipitation_data(data)

    except Exception as e:
        print(f"Error en el programa principal: {e}")

if __name__ == "__main__":
    main()