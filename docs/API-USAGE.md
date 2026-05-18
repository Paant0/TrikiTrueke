# API Usage (Frontend) - TrikiTrueke Backend

Guía para consumir el backend desde frontend (React, Angular, Vue o JS puro).

## 1) Base URL

- Local: `http://localhost:8080`

## 2) Autenticación y sesión

Este backend usa **Spring Security con sesión HTTP** (`JSESSIONID`), no JWT.

- Login con sesión: `POST /api/auth/login`
- Logout: `POST /api/auth/logout`
- Usuario actual: `GET /api/auth/me`
- Editar mi usuario: `PUT /api/auth/me`
- Eliminar mi usuario: `DELETE /api/auth/me`

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

#### `PUT /api/auth/me`
Actualiza el usuario autenticado actual.

Body (campos opcionales):
```json
{
  "nombre": "Juan Perez Actualizado",
  "email": "nuevo@mail.com",
  "telefono": "3009990000",
  "clave": "NuevaClave123"
}
```

Respuesta: `200 OK` con `UsuarioDTO` actualizado.

#### `DELETE /api/auth/me`
Elimina la cuenta del usuario autenticado actual y cierra su sesión.

Respuesta:
```json
{
  "message": "Usuario eliminado correctamente"
}
```

---

### Usuarios (`/usuarios`)

Todos responden envueltos en `ApiResponse`.

#### `GET /usuarios`
Lista usuarios.

#### `GET /usuarios/{id}`
Obtiene usuario por id.

---

### Categorías (`/categorias`) *(requiere sesión autenticada)*

Todos responden envueltos en `ApiResponse`.

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
  "descripcion": "Dispositivos y accesorios",
  "imagen": "example.png"
}
```

#### `PUT /categorias/{id}`
Actualiza categoría.

#### `DELETE /categorias/{id}`
Elimina categoría.

---

### Artículos (`/articulos`) *(requiere sesión autenticada)*

Todos responden envueltos en `ApiResponse`.

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

Todos responden envueltos en `ApiResponse`.

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

## 5) Formato de respuestas exitosas

En `usuarios`, `categorias`, `articulos` e `intercambios`, la respuesta usa este formato:

```json
{
  "success": true,
  "status": 200,
  "message": "Texto",
  "data": {},
  "path": "/ruta",
  "timestamp": "2026-05-13T00:00:00Z"
}
```

Nota: algunos endpoints de borrado retornan cuerpo con `status: 204`, pero el HTTP real suele salir como `200` porque no se construye `ResponseEntity.noContent()`.
## 6) Ejemplos frontend

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

## 7) Nota de CORS (importante)

- Hay configuración global CORS para `http://localhost:4200` con métodos y headers `*`.
- `AuthController` y `GlobalExceptionHandler` también tienen `@CrossOrigin("http://localhost:4200")`.

Si frontend corre en otro origen (ej: `http://localhost:3000`), debes agregar ese origen en backend.

## 8) Nota de seguridad (estado actual)

La seguridad efectiva es:

- Público: `POST /api/auth/register`, `POST /api/auth/login`.
- Requiere sesión: el resto de endpoints.

Existe una regla en `SecurityConfig` para `/api/categorias/**`, pero los endpoints reales están en `/categorias/**`, por lo que hoy **no quedan públicos**.
