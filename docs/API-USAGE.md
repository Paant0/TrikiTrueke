# API Usage (Frontend) - TrikiTrueke Backend

Guía para consumir el backend desde frontend (React, Angular, Vue o JS puro).

## 1) Base URL

- Local: `http://localhost:8080`

## 2) Autenticación y sesión

Este backend usa **Spring Security con sesión HTTP** (`JSESSIONID`), no JWT.

- Login con sesión: `POST /api/auth/login`
- Logout: `POST /api/auth/logout`
- Usuario actual: `GET /api/auth/me`

Para que el navegador envíe/reciba cookie de sesión:

- `fetch`: usar `credentials: "include"`
- `axios`: usar `withCredentials: true`

## 3) Formato de errores

En la mayoría de errores de negocio, la API responde:

```json
{
  "success": false,
  "status": 400,
  "message": "Mensaje de error",
  "data": null,
  "path": "/ruta",
  "timestamp": "2026-05-08T00:00:00Z"
}
```

## 4) Endpoints

### Auth (`/api/auth`)

#### `POST /api/auth/register`
Registra usuario (crea contraseña en BCrypt).

Body:
```json
{
  "nombre": "Juan Perez",
  "email": "juan@mail.com",
  "telefono": "3001234567",
  "clave": "MiClave123"
}
```

Respuesta: `201 Created` con `UsuarioDTO` (sin campo `clave` en la respuesta).

#### `POST /api/auth/login`
Inicia sesión y crea cookie `JSESSIONID`.

Body:
```json
{
  "email": "juan@mail.com",
  "clave": "MiClave123"
}
```

Respuesta: `200 OK` con `UsuarioDTO`.

#### `POST /api/auth/logout`
Cierra sesión actual.

Respuesta:
```json
{
  "message": "Sesion cerrada correctamente"
}
```

#### `GET /api/auth/me`
Devuelve el usuario autenticado actual.

Respuesta: `200 OK` con `UsuarioDTO`.

---

### Usuarios (`/usuarios`)

#### `POST /usuarios`
Registro alterno. Responde envuelto en `ApiResponse<UsuarioDTO>`.

#### `POST /usuarios/login`
Login alterno por servicio de usuario. Responde `ApiResponse<UsuarioDTO>`.

Nota: este endpoint valida credenciales pero **no establece contexto de sesión de Spring Security** como `/api/auth/login`.

---

### Categorías (`/categorias`) *(requiere sesión autenticada)*

#### `GET /categorias`
Lista categorías.

#### `GET /categorias/{id}`
Obtiene una categoría por id.

#### `POST /categorias`
Crea categoría.

Body:
```json
{
  "nombre": "Tecnologia",
  "descripcion": "Dispositivos y accesorios"
}
```

---

### Artículos (`/articulos`) *(requiere sesión autenticada)*

#### `POST /articulos`
Crea artículo.

Body:
```json
{
  "titulo": "iPhone 11",
  "descripcion": "Buen estado",
  "usuarioId": "681bf76f6805083ea0ae1b9a",
  "categoriaId": "681bf7846805083ea0ae1b9b",
  "fotos": ["https://.../foto1.jpg"]
}
```

Notas:
- `usuarioId` es obligatorio y debe existir.
- `estado` y `creadoEn` los asigna backend (`DISPONIBLE`, fecha actual).

#### `GET /articulos`
Lista artículos.

#### `GET /articulos/{id}`
Obtiene artículo por id.

#### `PUT /articulos/{id}`
Actualiza artículo completo.

#### `DELETE /articulos/{id}`
Elimina artículo.

---

### Intercambios (`/intercambios`) *(requiere sesión autenticada)*

#### `POST /intercambios`
Crea intercambio.

Body:
```json
{
  "articuloOfrecido": "681bf7a96805083ea0ae1b9c",
  "articuloRecibido": "681bf7b56805083ea0ae1b9d",
  "usuarioOfrece": "681bf76f6805083ea0ae1b9a",
  "usuarioRecibe": "681bf7906805083ea0ae1b9e"
}
```

Notas:
- Todos los campos anteriores son obligatorios.
- `estado` y `creadoEn` los asigna backend (`PENDIENTE`, fecha actual).
- Valida que `articuloOfrecido` pertenezca a `usuarioOfrece`.

#### `GET /intercambios`
Lista intercambios.

#### `GET /intercambios/{id}`
Obtiene intercambio por id.

#### `PUT /intercambios/{id}`
Actualiza intercambio.

#### `DELETE /intercambios/{id}`
Elimina intercambio.

## 5) Ejemplos frontend

### `fetch` con sesión

```ts
const API = "http://localhost:8080";

// login
await fetch(`${API}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ email: "juan@mail.com", clave: "MiClave123" })
});

// endpoint protegido
const categoriasRes = await fetch(`${API}/categorias`, {
  credentials: "include"
});
const categorias = await categoriasRes.json();
```

### `axios` con sesión

```ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true
});

await api.post("/api/auth/login", {
  email: "juan@mail.com",
  clave: "MiClave123"
});

const { data } = await api.get("/categorias");
```

## 6) Nota de CORS (importante)

- `UsuarioController` permite `http://localhost:4200`.
- `ArticuloController` permite `*`.
- `AuthController`, `CategoriaController` e `IntercambioController` no tienen `@CrossOrigin`.

Si frontend corre en otro origen (ej: `http://localhost:3000`), conviene configurar CORS global en backend para evitar bloqueos del navegador en login y endpoints protegidos.
