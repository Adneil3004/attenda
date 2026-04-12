# 📚 Centro de Documentación - Attenda

Bienvenido al centro de documentación técnica de Attenda. Esta guía está diseñada para proporcionar una visión completa del estado actual del sistema, tanto para desarrolladores humanos como para agentes de IA.

## Índice de Documentación

### 1. 🏗️ [Arquitectura del Sistema](./ARCHITECTURE.md)
Descripción de las capas (.NET Clean Architecture), patrones de diseño (CQRS/MediatR) y el flujo de datos entre el Frontend y los Handlers de Aplicación.

### 2. 🧩 [Modelos de Dominio](./DOMAIN_MODELS.md)
Detalles sobre los Agregados (`Event`, `User`), Entidades (`Guest`, `TaskItem`) y reglas de negocio centrales. Incluye el manejo de límites de capacidad, plus-ones y restricciones dietéticas.

### 3. 🔌 [Referencia de API y Comandos](./API_REFERENCE.md)
Mapeo de endpoints REST para Eventos e Invitados, comandos MediatR y estructura de DTOs. Documenta las operaciones por lotes (batch operations) de gestión de listas.

### 4. 🎨 [Guía del Frontend](./FRONTEND_GUIDE.md)
Estructura de React/Vite, navegación del Dashboard, componentes premium (`GuestDrawer`, `Sidebar`) y estilizado interactivo con Tailwind v4 y Framer Motion.

### 5. ☁️ [Infraestructura y Supabase](./INFRASTRUCTURE.md)
Detalles sobre la integración con Supabase (Auth, Funciones Edge, Postgres), políticas de seguridad Row Level Security (RLS) y servicios de infraestructura cloud.

---

## Cómo empezar a desarrollar
1. Clona el repositorio.
2. Configura el `appsettings.json` en el backend con tu cadena de conexión de Supabase.
3. Ejecuta `dotnet run` en la carpeta `/backend/src/Attenda.API`.
4. Ejecuta `npm install` y `npm run dev` en la carpeta `/frontend`.

---
*Documentación generada automáticamente y mantenida bajo el sistema de optimización de agentes de Attenda.*
