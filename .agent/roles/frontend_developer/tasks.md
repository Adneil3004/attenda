# 🎨 Frontend Developer Tasks - Guest Deletion

Este agente debe implementar la UI para la gestión de invitados, permitiendo selección múltiple y eliminación segura.

## Tareas Pendientes

### 1. Tabla de Invitados (Guests.jsx)
- [x] **Selección Múltiple**:
  - Añadir checkbox en la cabecera (seleccionar todo) y en cada fila.
  - Mantener un estado de `selectedGuestIds`.
- [x] **Acciones Individuales**:
  - Añadir icono de papelera (Trash) al final de cada fila.

### 2. Botones de Acción
- [x] **Eliminar Seleccionados**: Botón que aparece solo cuando hay invitados marcados.
- [x] **Eliminar Todos**: Botón visible para vaciar la lista del evento actual.

### 3. Modales de Confirmación
- [x] Implementar un modal de **Doble Confirmación** para "Eliminar Todos".
  - El usuario debe escribir una palabra clave (ej. "BORRAR") o realizar un segundo paso de confirmación.
- [x] Implementar confirmación simple para eliminación individual/selectiva.

### 4. Integración API
- [x] **Migración a Backend API**: Cambiar las llamadas directas de `supabase` en `handleDeleteSingle`, `handleDeleteSelected` y `handleDeleteAll` por llamadas `fetch` a `GuestsController`.
  - [x] `DELETE /api/guests/batch`
  - [x] `DELETE /api/guests/all/{eventId}`
- [x] **Manejo de Errores**: Implementar notificaciones (alert o toast) si el Backend devuelve 401 o 403.


## Hito 3: Visuals & Data
### 1. Conexión de Datos
- [ ] Conectar `Overview.jsx` con el nuevo endpoint de Dashboard.

### 2. Estética & UX (Concierge)
- [ ] Implementar efecto "Sheen" en cards y botones.
- [ ] Añadir micro-animaciones en transiciones de estado.

### 3. Responsividad
- [ ] Optimizar vista de invitados para pantallas pequeñas.

*Modelo Recomendado: Gemini 1.5 Flash (Iteración Visual)*


## Notas de Sincronización (Director)
- El Backend utiliza `Authorize` y espera el `UserId` del claim de identidad del JWT. Asegurar que el token se envíe en el header `Authorization`.
- Refrescar la lista de invitados tras una eliminación exitosa.
