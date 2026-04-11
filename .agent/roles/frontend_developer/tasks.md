# 🎨 Frontend Developer Tasks - Guest Deletion

Este agente debe implementar la UI para la gestión de invitados, permitiendo selección múltiple y eliminación segura.

## Tareas Pendientes

### 1. Tabla de Invitados (Guests.jsx)
- [ ] **Selección Múltiple**:
  - Añadir checkbox en la cabecera (seleccionar todo) y en cada fila.
  - Mantener un estado de `selectedGuestIds`.
- [ ] **Acciones Individuales**:
  - Añadir icono de papelera (Trash) al final de cada fila.

### 2. Botones de Acción
- [ ] **Eliminar Seleccionados**: Botón que aparece solo cuando hay invitados marcados.
- [ ] **Eliminar Todos**: Botón visible para vaciar la lista del evento actual.

### 3. Modales de Confirmación
- [ ] Implementar un modal de **Doble Confirmación** para "Eliminar Todos".
  - El usuario debe escribir una palabra clave (ej. "BORRAR") o realizar un segundo paso de confirmación.
- [ ] Implementar confirmación simple para eliminación individual/selectiva.

### 4. Integración API
- [ ] Conectar los botones a los nuevos endpoints de `GuestsController`.

## Notas de Sincronización
- Refrescar la lista de invitados tras una eliminación exitosa.
