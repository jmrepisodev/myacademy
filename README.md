# myacademy

# 🛠️ Proyecto Node.js + React

Este proyecto contiene una aplicación dividida en dos partes:

- **Frontend**: construido con React (`/client`)
- **Backend**: construido con Node.js y Express (`/server`)

## 🚀 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- ✅ [Node.js](https://nodejs.org/) (v18 o superior recomendado)
- ✅ [npm](https://www.npmjs.com/)
- ✅ [Git](https://git-scm.com/)
- ✅ Base datos local MySQL (PHPAdmin)

Verifica las versiones:

```bash
node -v
npm -v
git --version

```
## Configuración e instalación

## Clona el proyecto
```
git clone https://github.com/jmrepisodev/myacademy.git
cd repositorio
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
## Genera la base de datos y los datos de ejemplo

Crea una base de datos SQL con el nombre "myacademy_db". A continuación, genera las tablas y los datos de ejemplo 
con la ayuda del script adjunto.

## Inicia el backend y el frontend

Desde las carpetas de servidor y cliente. Usa el mismo comando para iniciar ambos.

Frontend y Backend
````
npm start
````

A continuación puedes acceder al servidor y el frontend, de forma local, en las direcciones siguientes:

- Servidor: http://localhost:5000

- Cliente:  http://localhost:3000