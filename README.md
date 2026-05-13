# SplitItEasy

SplitItEasy es una aplicación web full stack creada para organizar grupos, mantener chats y, en el futuro, facilitar la división de gastos entre usuarios. El proyecto fue desarrollado usando **Angular** para el frontend, **Node.js + Express** para el backend y **MongoDB Atlas** como base de datos.

La aplicación incluye autenticación, perfiles editables, creación de grupos, chats persistentes y un asistente de IA capaz de responder preguntas o analizar imágenes enviadas por el usuario.

---

# Funcionalidades principales

* Registro e inicio de sesión.
* Persistencia de usuarios en MongoDB Atlas.
* Perfil editable.
* Header dinámico según el usuario autenticado.
* Creación y administración de grupos.
* Vista individual de cada grupo.
* Agregar miembros usando username o email.
* Chat grupal persistente.
* Integración con IA assistant.
* Subida de imágenes para análisis con IA.
* Comunicación frontend-backend mediante APIs REST.
* Arquitectura basada en Angular standalone components.
* Deploy usando Vercel y Render.

---

# Tecnologías utilizadas

## Frontend

* Angular
* TypeScript
* HTML
* CSS
* RxJS

## Backend

* Node.js
* Express
* MongoDB Atlas
* Mongoose
* Multer
* Axios

## Extras

* REST API
* OpenRouter (IA assistant)

---

# Estructura del proyecto

```text
splititeasy/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── pipes/
│   │   │   ├── app.routes.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.ts
│   │   ├── main.ts
│   │   └── styles.css
│   └── ...
│
└── backend/
    ├── config/
    │   └── db.js
    ├── models/
    │   ├── User.js
    │   ├── Group.js
    │   └── Message.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── chat.routes.js
    │   └── groups.routes.js
    ├── index.js
    └── .env
```

---

# Componentes principales del frontend

* `groups`
* `group-detail`
* `login`
* `profile`
* `header`
* `technologies`
* `upgrade`

## Services principales

* `auth.service.ts`
* `groups.service.ts`
* `chat.service.ts`
* `profile.service.ts`

## Pipes

* `greeting-pipe.ts` es el pipe perzonalizado
* `date pipe` es el pipe definido 

---

# Modelos principales del backend

* `User`
* `Group`
* `Message`

---

# Flujo general de la aplicación

1. El usuario se registra.
2. El backend guarda la información en MongoDB.
3. El usuario inicia sesión.
4. El frontend almacena la sesión en `localStorage`.
5. El usuario puede crear o entrar a grupos.
6. Dentro del grupo puede agregar miembros.
7. Los usuarios envían mensajes al chat grupal.
8. Los mensajes quedan guardados en MongoDB.
9. El usuario puede editar su perfil y sincronizar cambios.
10. EL usuario puede consultar al asistente de AI (SplititeasyAI) y adjuntar fotos para analizarlas

---

# Requisitos previos

Antes de ejecutar el proyecto de forma local necesitas:

* Node.js
* npm
* Angular CLI
* MongoDB Atlas
* API Key del servicio de IA

---

# Variables de entorno

## Backend

Crear un archivo `.env` dentro de `backend/`

```env
PORT=3000
MONGO_URI=tu_uri_de_mongodb
OPENROUTER_API_KEY=tu_api_key
```

> Importante: no subir el archivo `.env` al repositorio.

## Frontend

Revisar las URLs base utilizadas en:

* `AuthService`
* `GroupsService`
* `ChatService`
* `ProfileService`

Actualmente apuntan al backend desplegado en Render.

---

# Proyecto desplegado

El proyecto ya se encuentra desplegado online:

* **Frontend (Vercel):** https://final-project-roan-eight-72.vercel.app/groups
* **Backend / Deploy (Render):** https://dashboard.render.com/project/prj-d80jmd8sfn5c739j2gfg
* **Base de datos:** MongoDB Atlas

Por lo tanto, no es obligatorio correrlo localmente para utilizarlo.

---

# Ejecución local

## Backend

```bash
cd backend
npm install
npm start
```

O también:

```bash
node index.js
```

## Frontend

```bash
cd frontend
npm install
ng serve
```

---

# Importante

Si ejecutas el proyecto localmente, recuerda cambiar las URLs de los services.

Por ejemplo:

```ts
https://splititeasy-backend.onrender.com
```

por:

```ts
http://localhost:3000
```

Esto aplica para autenticación, grupos, perfil y chat.

---

# Rutas principales del backend

## Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/me/:id`
* `PUT /api/auth/profile/:id`

## Groups

* `GET /api/groups/user/:userId`
* `GET /api/groups/:id`
* `POST /api/groups`
* `POST /api/groups/:id/members`
* `POST /api/groups/:id/messages`

## Chat

* `GET /api/chat`
* `POST /api/chat`
* `PATCH /api/chat/:id`

---

# Rutas principales del frontend

* `/groups`
* `/groups/:id`
* `/login`
* `/registro`
* `/perfil`
* `/technologies`
* `/upgrade`

---

# Persistencia y manejo de estado

La sesión del usuario se maneja principalmente usando:

* `AuthService`
* `BehaviorSubject`
* `localStorage`

Esto permite:

* mantener la sesión activa al recargar,
* actualizar automáticamente datos del header,
* acceder fácilmente al usuario autenticado,
* y evitar repetir lógica entre componentes.

---

# Chat con IA

El asistente de IA funciona desde el backend:

* recibe mensajes del usuario,
* puede recibir imágenes,
* envía la petición al modelo de IA,
* guarda respuestas en MongoDB,
* y devuelve el historial al frontend.

De esta forma el chat mantiene persistencia entre sesiones.

---

# Grupos y chat grupal

Cada grupo almacena:

* nombre,
* creador,
* miembros,
* mensajes.

Desde la vista de detalle se puede:

* ver participantes,
* agregar miembros,
* enviar mensajes,
* consultar el historial del chat.

---

# Posibles mejoras futuras

* Implementar Socket.IO para tiempo real.
* Separar lógica usando controllers.
* Implementar Angular guards.
* Mejorar validaciones y manejo de errores.

---

# Arquitectura general

```text
Angular → Express → MongoDB
```

El frontend maneja la interfaz y experiencia de usuario.

El backend centraliza la lógica de negocio y acceso a datos.

MongoDB almacena usuarios, grupos y mensajes.

---

# Deploy

El proyecto fue pensado para trabajar con:

* Vercel
* Render
* MongoDB Atlas

Si cambias producción por entorno local, revisa:

* CORS,
* variables de entorno,
* endpoints,
* y URLs de los services.

---

# Autores

Miguel Cuevas -20250328
Jimena Estrada -20250126