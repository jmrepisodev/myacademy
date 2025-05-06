# myacademy


# 🏫 Descripción del Proyecto.

MyAcademy es una plataforma educativa compuesta por dos aplicaciones independientes:

🎨 Frontend: Aplicación en React (/client)

🧠 Backend: API RESTful con Node.js, Express y MySQL (/server)

# 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- ✅ [Node.js] (https://nodejs.org/) (v18 o superior recomendado)
- ✅ [npm] (https://www.npmjs.com/)
- ✅ [Git] (https://git-scm.com/)
- ✅ [MySQL]	(https://dev.mysql.com/downloads/)

También puedes usar phpMyAdmin para administrar la base de datos de manera visual.

Verifica las versiones:

```bash
node -v
npm -v
git --version
mysql --version

```
## Configuración e instalación

## Clona el proyecto
```
git clone https://github.com/jmrepisodev/myacademy.git
cd myacademy
```

## Instala las dependencias

Frontend
````
cd server
npm install
````

Backend
````
cd client
npm install
````
## Crea los archivos de variables de entorno

Genera los archivos .env y edita los datos necesarios

````
cp server/.env.example server/.env
cp client/.env.example client/.env
````

🔧 Ejemplo de .env para el backend:
````
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=myacademy_db

CLIENT_URL=http://localhost:3000
API_URL=http://localhost:5000

JWT_SECRET=supersecreto123
````

🌐 Ejemplo de .env para el frontend:
````
REACT_APP_API_URL=http://localhost:5000
````

## Configura la URL base del servidor en el cliente 

Modifica el archivo api.js de la carpeta services. Agrega la URL de tu servidor, por defecto http://localhost:5000

## 🧱 Configuración de la Base de Datos
Abre tu gestor de base de datos (por ejemplo, phpMyAdmin o consola MySQL).

Crea la base de datos:
````
CREATE DATABASE myacademy_db;
````

Ejecuta el script SQL incluido en el proyecto para generar las tablas y datos de ejemplo.

## Inicia el backend y el frontend

Desde las carpetas de servidor y cliente. Usa el mismo comando para iniciar ambos.

Frontend y Backend

````
npm start
````

A continuación puedes acceder al servidor y el frontend, de forma local, en las direcciones siguientes:

- Servidor: http://localhost:5000

- Cliente:  http://localhost:3000

---------------