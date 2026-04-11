# ⚙️ Backend Developer Tasks - Guest Deletion

Este agente debe implementar la capacidad de eliminar invitados de forma individual, selectiva (varios a la vez) y masiva (todos).

## Tareas Pendientes

### 1. Modificar Dominio
- [ ] En `Attenda.Domain/Aggregates/EventAggregate/Event.cs`:
  - Añadir `RemoveGuests(IEnumerable<Guid> guestIds)`.
  - Añadir `ClearGuests()`.

### 2. Comandos MediatR
- [ ] Crear `DeleteGuestsCommand.cs` en `Attenda.Application/Guests/Commands/DeleteGuests/`.
  - Debe recibir una lista de `GuestIds`.
- [ ] Crear `DeleteAllGuestsCommand.cs` en `Attenda.Application/Guests/Commands/DeleteAllGuests/`.
  - Debe recibir un `EventId`.

### 3. API Controller
- [ ] Crear `GuestsController.cs` en `Attenda.API/Controllers/`.
- [ ] Implementar `DELETE /api/guests` (recibe lista de IDs en el body).
- [ ] Implementar `DELETE /api/guests/event/{eventId}/all` (borrado masivo).

## Notas de Sincronización
- Asegurar que el borrado sea definitivo (hard delete) según los requerimientos.
- Validar que el usuario sea el dueño del evento antes de borrar invitados.
