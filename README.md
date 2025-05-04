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
````
cd server
npm install
````

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

## Inicia el backend y el frontend

Desde las carpetas de servidor y cliente. Usa el mismo comando para iniciar.

````
npm start
````

A continuación puedes acceder al servidor y el frontend, de forma local, en las direcciones siguientes:

- Servidor: http://localhost:5000

- Cliente:  http://localhost:3000