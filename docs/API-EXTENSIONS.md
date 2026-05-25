# Extensiones de API sugeridas

Este documento propone endpoints adicionales y reglas de negocio para soportar correctamente las operaciones relacionadas con artículos del usuario e intercambios. Está pensado para implementarse en el backend (Spring Boot u otro) y consumirse desde el frontend (Angular). Todas las rutas protegidas asumen autenticación por sesión (cookie `JSESSIONID`) y usan el formato `ApiResponse` documentado en `API-USAGE.md`.

## Principios
- Todas las respuestas usan el envoltorio `ApiResponse`:

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

- Todas las rutas que requieren sesión deben usar `withCredentials=true` (frontend) y verificar el `Principal`/sesión en backend.
- Reglas importantes deben aplicarse en backend (autorización/ownership): el frontend solo muestra/oculta UI, la autorización real se valida server-side.

---

## Endpoints propuestos

### Artículos del usuario

1) `GET /api/articulos/mis` — Listar mis artículos

- Descripción: devuelve los artículos cuyo `usuarioId` coincide con el usuario autenticado en la sesión.
- Requiere sesión.
- Respuesta: `200 OK` con `data: [ArticuloDTO]`.
- Ejemplo (curl):

```bash
curl -i -c cookiejar -b cookiejar -X GET "http://localhost:8080/api/articulos/mis"
```

Reglas / notas:
- No confiar en `usuarioId` pasado por el cliente.
- Paginación y filtros opcionales (`?page=0&size=20&estado=DISPONIBLE`).

2) `GET /api/articulos/{id}` — Obtener artículo por id

- Descripción: devuelve el artículo si existe. Si el artículo existe pero pertenece a otro usuario, devolver igualmente (lectura pública) o aplicar reglas según negocio.

3) `POST /api/articulos` — Crear artículo

- Body (ejemplo):

```json
{
  "titulo": "iPhone 11",
  "descripcion": "Buen estado",
  "categoriaId": "681bf7846805083ea0ae1b9b",
  "fotos": ["https://.../foto1.jpg"]
}
```

- Notas: el backend debe asignar `usuarioId` desde la sesión del usuario autenticado (no debe confiar en el campo que envía el cliente). Validar campos obligatorios.

4) `PUT /api/articulos/{id}` — Actualizar artículo

- Reglas: solo permite actualizar si el `usuarioId` del artículo coincide con el usuario autenticado. Validar autorización y campos.

5) `DELETE /api/articulos/{id}` — Eliminar artículo

- Reglas: solo el autor puede eliminar. Responder 403 si el usuario no es propietario.

---

### Intercambios (exchanges)

1) `POST /api/intercambios` — Crear intercambio (oferta)

- Body (ejemplo):

```json
{
  "articuloOfrecido": "681bf7a96805083ea0ae1b9c",
  "articuloRecibido": "681bf7b56805083ea0ae1b9d"
}
```

- Reglas importantes (server-side):
  - `usuarioOfrece` se toma del usuario autenticado en la sesión (no del body). El backend debe comprobar que `articuloOfrecido.usuarioId === usuarioOfrece`.
  - `articuloRecibido` debe existir.
  - Crear registro en `intercambios` con `usuarioOfrece`, `usuarioRecibe` (tomado del `usuarioId` del `articuloRecibido`), `estado: PENDIENTE`.

- Respuesta: `201 Created` con `data: IntercambioDTO`.

2) `GET /api/intercambios/mis` — Listar intercambios donde soy parte

- Descripción: devuelve intercambios en los que el usuario autenticado es `usuarioOfrece` o `usuarioRecibe`.
- Soporta filtros: `?estado=PENDIENTE`, paginación, orden.

3) `GET /api/intercambios/{id}` — Obtener intercambio por id (solo si el usuario es parte o tiene permiso)

4) `PUT /api/intercambios/{id}/aceptar` — Aceptar intercambio (solo `usuarioRecibe` puede aceptar)

- Comportamiento:
  - Cambia estado a `ACEPTADO` y marca `fechaAceptacion`.
  - Opcional: ejecutar lógica de intercambio (actualizar estado de artículos, notificar usuarios).

5) `PUT /api/intercambios/{id}/rechazar` — Rechazar intercambio (solo `usuarioRecibe`)

6) `DELETE /api/intercambios/{id}` — Cancelar intercambio (solo `usuarioOfrece` mientras esté `PENDIENTE`)

---

### Endpoints de utilidad / administración

- `GET /api/articulos/pendientes` — listar artículos en estado pendiente (admin)
- `POST /api/articulos/{id}/force-assign` — (admin) asignar `usuarioId` si hay datos corruptos (usar con precaución)

---

## Formatos y validaciones recomendadas

- `ArticuloDTO` (ejemplo):

```json
{
  "id": "...",
  "titulo": "",
  "descripcion": "",
  "usuarioId": "...", // string
  "categoriaId": "...",
  "fotos": ["..."],
  "estado": "DISPONIBLE",
  "creadoEn": "2026-05-13T..."
}
```

- Validaciones server-side:
  - `titulo`: not blank
  - `categoriaId`: not blank and exists
  - `usuarioId`: tomado desde sesión; comprobar existencia
  - `estado`: enum válido

## Recomendaciones de seguridad

- Autorizar por sesión: obtener `usuarioId` desde `Principal` en Spring (o user session) y no desde el body.
- Verificar ownership en PUT/DELETE: devolver `403 Forbidden` si el usuario no es propietario.
- Para crear intercambios: comprobar en backend que `articuloOfrecido` pertenece al usuario que crea la oferta.

## Ejemplos rápidos (curl)

- Crear intercambio (cliente):

```bash
curl -X POST "http://localhost:8080/api/intercambios" \
  -H "Content-Type: application/json" \
  -b cookiejar -c cookiejar \
  -d '{"articuloOfrecido":"idA","articuloRecibido":"idB"}'
```

- Listar mis artículos (cliente):

```bash
curl -X GET "http://localhost:8080/api/articulos/mis" -b cookiejar -c cookiejar
```

---

Si quieres, puedo:

- Generar la implementación server-side de ejemplo (snippets Spring Boot + Repositorio + Controller) para `GET /api/articulos/mis` y `POST /api/intercambios`.
- Generar el script de migración Mongo (`updateMany`) para convertir `usuarioId` ObjectId a string.

Dime cuál quieres que haga ahora (snippets backend, script mongo o ambos). 
