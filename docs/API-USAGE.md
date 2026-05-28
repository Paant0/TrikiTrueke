# API Usage (Frontend) - TrikiTrueke Backend

Guía para consumir el backend desde frontend (React, Angular, Vue o JS puro). Esta documentación describe el contrato real de los DTO que expone la API: qué enviar, qué recibe el backend y qué campos genera o completa el servidor.

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

## 3) Formato de DTO y tipos

- `String`: texto normal.
- `ObjectId`: se envía y recibe como `string` hexadecimal de MongoDB, por ejemplo `"681bf76f6805083ea0ae1b9a"`.
- `Date`: se recibe como valor serializado por Jackson. En frontend trátalo como string de fecha.
- `LocalDateTime`: se recibe como valor serializado por Jackson. En frontend trátalo como string de fecha/hora.

## 4) DTOs principales

### `UsuarioDTO`

Campos:
```json
{
  "id": "string",
  "nombre": "string",
  "clave": "string",
  "email": "string",
  "telefono": "string",
  "creadoEn": "date"
}
```

Notas:
- `id` lo genera MongoDB.
- `clave` es de escritura solamente en las respuestas de `UsuarioDTO` por `@JsonProperty(WRITE_ONLY)`.
- `creadoEn` lo asigna el backend al registrar.

### `LoginRequest`

Campos:
```json
{
  "email": "string",
  "clave": "string"
}
```

### `CategoriaDTO`

Campos:
```json
{
  "id": "string",
  "nombre": "string",
  "descripcion": "string",
  "imagen": "string"
}
```

### `ArticuloDTO`

Campos:
```json
{
  "id": "string",
  "nombre": "string",
  "descripcion": "string",
  "usuarioId": "objectId",
  "categoriaId": "objectId",
  "categoria": "string",
  "imagen": "string",
  "estado": "string",
  "creadoEn": "date-time"
}
```

Notas:
- `usuarioId` y `categoriaId` se envían como string hexadecimal de `ObjectId`.
- `categoria` es un campo derivado que el backend completa al listar artículos.
- `estado` y `creadoEn` los asigna el backend al crear.

### `ArticuloResponseDTO`

Campos:
```json
{
  "id": "string",
  "nombre": "string",
  "descripcion": "string",
  "usuarioId": "string",
  "categoriaId": "string",
  "categoria": "string",
  "imagen": "string",
  "estado": "string",
  "creadoEn": "date-time"
}
```

Notas:
- Es el DTO que devuelve la API para artículos.
- Los campos relacionales ya salen como `string`.

### `IntercambioDTO`

Campos:
```json
{
  "id": "string",
  "estado": "string",
  "articuloOfrecido": "objectId",
  "articuloRecibido": "objectId",
  "usuarioOfrece": "objectId",
  "usuarioRecibe": "objectId",
  "creadoEn": "date"
}
```

Notas:
- Los cuatro campos de referencia (`articuloOfrecido`, `articuloRecibido`, `usuarioOfrece`, `usuarioRecibe`) se envían como string hexadecimal de `ObjectId`.
- `estado` y `creadoEn` los asigna el backend al crear.

### `IntercambioResponseDTO`

Campos:
```json
{
  "id": "string",
  "estado": "string",
  "articuloOfrecido": "string",
  "articuloRecibido": "string",
  "usuarioOfrece": "string",
  "usuarioRecibe": "string",
  "creadoEn": "date"
}
```

Notas:
- Es el DTO que devuelve la API para intercambios.
- Los IDs relacionados ya salen como `string`.

## 5) Formato de errores

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

## 6) Endpoints

### Auth (`/api/auth`)

#### `POST /api/auth/register`
Registra usuario (crea contraseña en BCrypt).

Request `UsuarioDTO`:
```json
{
  "nombre": "Juan Perez",
  "email": "juan@mail.com",
  "telefono": "3001234567",
  "clave": "MiClave123"
}
```

Respuesta: `201 Created` con `UsuarioDTO` sin `clave`.

Respuesta `UsuarioDTO`:
```json
{
  "id": "681bf76f6805083ea0ae1b9a",
  "nombre": "Juan Perez",
  "email": "juan@mail.com",
  "telefono": "3001234567",
  "creadoEn": "2026-05-25T20:11:26.183+00:00"
}
```

#### `POST /api/auth/login`
Inicia sesión y crea cookie `JSESSIONID`.

Request `LoginRequest`:
```json
{
  "email": "juan@mail.com",
  "clave": "MiClave123"
}
```

Respuesta: `200 OK` con `UsuarioDTO`.

Respuesta `UsuarioDTO`:
```json
{
  "id": "681bf76f6805083ea0ae1b9a",
  "nombre": "Juan Perez",
  "email": "juan@mail.com",
  "telefono": "3001234567",
  "creadoEn": "2026-05-25T20:11:26.183+00:00"
}
```

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

Request `UsuarioDTO` de actualización parcial:
```json
{
  "nombre": "Juan Perez Actualizado",
  "email": "nuevo@mail.com",
  "telefono": "3009990000",
  "clave": "NuevaClave123"
}
```

Respuesta: `200 OK` con `UsuarioDTO` actualizado.

Respuesta `UsuarioDTO`:
```json
{
  "id": "681bf76f6805083ea0ae1b9a",
  "nombre": "Juan Perez Actualizado",
  "email": "nuevo@mail.com",
  "telefono": "3009990000",
  "creadoEn": "2026-05-25T20:11:26.183+00:00"
}
```

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

Respuesta: `List<UsuarioDTO>` dentro de `ApiResponse`.

Ejemplo:
```json
[
  {
    "id": "681bf76f6805083ea0ae1b9a",
    "nombre": "Juan Perez",
    "email": "juan@mail.com",
    "telefono": "3001234567",
    "creadoEn": "2026-05-25T20:11:26.183+00:00"
  }
]
```

#### `GET /usuarios/{id}`
Obtiene usuario por id.

Respuesta: `UsuarioDTO`.

---

### Categorías (`/categorias`) *(requiere sesión autenticada)*

Todos responden envueltos en `ApiResponse`.

#### `GET /categorias`
Lista categorías.

Respuesta: `List<CategoriaDTO>`.

Ejemplo:
```json
[
  {
    "id": "681bf7846805083ea0ae1b9b",
    "nombre": "Tecnologia",
    "descripcion": "Dispositivos y accesorios",
    "imagen": "example.png"
  }
]
```

#### `GET /categorias/{id}`
Obtiene una categoría por id.

Respuesta: `CategoriaDTO`.

#### `POST /categorias`
Crea categoría.

Request `CategoriaDTO`:
```json
{
  "nombre": "Tecnologia",
  "descripcion": "Dispositivos y accesorios",
  "imagen": "example.png"
}
```

Respuesta: `CategoriaDTO` creado con `id`.

#### `PUT /categorias/{id}`
Actualiza categoría.

Request `CategoriaDTO`:
```json
{
  "nombre": "Tecnologia",
  "descripcion": "Dispositivos y accesorios",
  "imagen": "example.png"
}
```

Respuesta: `CategoriaDTO` actualizado.

#### `DELETE /categorias/{id}`
Elimina categoría.

Respuesta: `ApiResponse<Void>`.

---

### Artículos (`/articulos`) *(requiere sesión autenticada)*

Todos responden envueltos en `ApiResponse`.

#### `POST /articulos`
Crea artículo.

Request `ArticuloDTO`:
```json
{
  "nombre": "iPhone 11",
  "descripcion": "Buen estado",
  "usuarioId": "681bf76f6805083ea0ae1b9a",
  "categoriaId": "681bf7846805083ea0ae1b9b",
  "imagen": "https://.../foto1.jpg"
}
```

Notas:
- `usuarioId` es obligatorio y debe existir.
- `categoriaId` es opcional en el backend actual, pero si lo envías debe ser un `ObjectId` válido.
- `estado` y `creadoEn` los asigna backend (`DISPONIBLE`, fecha actual).

Respuesta `ArticuloResponseDTO`:
```json
{
  "id": "681bf7a96805083ea0ae1b9c",
  "nombre": "iPhone 11",
  "descripcion": "Buen estado",
  "usuarioId": "681bf76f6805083ea0ae1b9a",
  "categoriaId": "681bf7846805083ea0ae1b9b",
  "categoria": "Tecnologia",
  "imagen": "https://.../foto1.jpg",
  "estado": "DISPONIBLE",
  "creadoEn": "2026-05-25T20:11:26.183"
}
```

#### `GET /articulos`
Lista artículos.

Respuesta: `List<ArticuloResponseDTO>`.

#### `GET /articulos/buscar?nombre=texto`
Busca artículos por nombre con coincidencia parcial e ignorando mayúsculas.

Request:
```text
nombre=iphone
```

Respuesta: `List<ArticuloResponseDTO>`.

#### `GET /articulos/mis`
Lista artículos del usuario autenticado (tomado desde la sesión).

Respuesta: `List<ArticuloResponseDTO>`.

#### `GET /articulos/{id}`
Obtiene artículo por id.

Respuesta: `ArticuloResponseDTO`.

#### `PUT /articulos/{id}`
Actualiza artículo completo.

Request `ArticuloDTO`:
```json
{
  "nombre": "iPhone 11 Pro",
  "descripcion": "Buen estado",
  "usuarioId": "681bf76f6805083ea0ae1b9a",
  "categoriaId": "681bf7846805083ea0ae1b9b",
  "imagen": "https://.../foto1.jpg",
  "estado": "DISPONIBLE"
}
```

Respuesta: `ArticuloResponseDTO` actualizado.

#### `DELETE /articulos/{id}`
Elimina artículo.

Respuesta: `ApiResponse<Void>`.

---

### Intercambios (`/intercambios`) *(requiere sesión autenticada)*

Todos responden envueltos en `ApiResponse`.

#### `POST /intercambios`
Crea intercambio.

Request `IntercambioDTO`:
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

Respuesta `IntercambioResponseDTO`:
```json
{
  "id": "681bf8a16805083ea0ae1ba1",
  "estado": "PENDIENTE",
  "articuloOfrecido": "681bf7a96805083ea0ae1b9c",
  "articuloRecibido": "681bf7b56805083ea0ae1b9d",
  "usuarioOfrece": "681bf76f6805083ea0ae1b9a",
  "usuarioRecibe": "681bf7906805083ea0ae1b9e",
  "creadoEn": "2026-05-25T20:11:26.183+00:00"
}
```

#### `GET /intercambios`
Lista intercambios.

Respuesta: `List<IntercambioResponseDTO>`.

#### `GET /intercambios/mis`
Lista intercambios donde el usuario autenticado participa (como `usuarioOfrece` o `usuarioRecibe`).

Respuesta: `List<IntercambioResponseDTO>`.

#### `GET /intercambios/{id}`
Obtiene intercambio por id.

Respuesta: `IntercambioResponseDTO`.

#### `PUT /intercambios/{id}`
Actualiza intercambio.

Request `IntercambioDTO`:
```json
{
  "estado": "PENDIENTE",
  "articuloOfrecido": "681bf7a96805083ea0ae1b9c",
  "articuloRecibido": "681bf7b56805083ea0ae1b9d",
  "usuarioOfrece": "681bf76f6805083ea0ae1b9a",
  "usuarioRecibe": "681bf7906805083ea0ae1b9e"
}
```

Respuesta: `IntercambioResponseDTO` actualizado.

#### `DELETE /intercambios/{id}`
Elimina intercambio.

Respuesta: `ApiResponse<Void>`.

#### `PUT /intercambios/{id}/aceptar`
Acepta intercambio. Solo puede hacerlo el usuario autenticado que coincide con `usuarioRecibe`.

#### `PUT /intercambios/{id}/rechazar`
Rechaza intercambio. Solo puede hacerlo el usuario autenticado que coincide con `usuarioRecibe`.

#### `DELETE /intercambios/{id}/cancelar`
Cancela intercambio. Solo puede hacerlo el usuario autenticado que coincide con `usuarioOfrece` y si el intercambio está en estado `PENDIENTE`.

## 7) Formato de respuestas exitosas

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
## 8) Ejemplos frontend

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

## 9) Nota de CORS (importante)

- Hay configuración global CORS para `http://localhost:4200` con métodos y headers `*`.
- `AuthController` y `GlobalExceptionHandler` también tienen `@CrossOrigin("http://localhost:4200")`.

Si frontend corre en otro origen (ej: `http://localhost:3000`), debes agregar ese origen en backend.

## 10) Nota de seguridad (estado actual)

La seguridad efectiva es:

- Público: `POST /api/auth/register`, `POST /api/auth/login`.
- Requiere sesión: el resto de endpoints.

Existe una regla en `SecurityConfig` para `/api/categorias/**`, pero los endpoints reales están en `/categorias/**`, por lo que hoy **no quedan públicos**.
