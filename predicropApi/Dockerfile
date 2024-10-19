# Usa una imagen base oficial de Python
FROM python:3.12-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo requirements.txt y luego instálalo
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Copia el código de la aplicación
COPY . .

# Expone el puerto 5000 para la aplicación Flask
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["flask", "run", "--host=0.0.0.0"]