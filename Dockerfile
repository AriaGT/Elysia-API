# Establecer la imagen base
FROM debian:buster-slim

# Instalar curl para poder descargar e instalar Bun
RUN apt-get update && apt-get install -y curl

# Instalar Bun
RUN curl -fsSL https://bun.sh/install | bash

# Establecer la variable de entorno para la ruta de instalación de Bun
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

# Crear un directorio para la aplicación
WORKDIR /app

# Copiar el archivo package.json al directorio de trabajo en el contenedor
COPY package.json ./

# Instalar las dependencias del proyecto
RUN bun install

# Copiar el resto de los archivos del proyecto al directorio de trabajo en el contenedor
COPY . .

# Establecer la variable de entorno PORT
ENV PORT=3000

# Exponer el puerto que la aplicación usará
EXPOSE 3000

# Comando para iniciar la aplicación
CMD [ "bun", "run", "dev" ]
