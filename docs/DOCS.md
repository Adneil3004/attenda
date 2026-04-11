# 📚 Centro de Documentación - Attenda

Bienvenido al centro de documentación técnica de Attenda. Esta guía está diseñada para proporcionar una visión completa del estado actual del sistema, tanto para desarrolladores humanos como para agentes de IA.

## Índice de Documentación

### 1. 🏗️ [Arquitectura del Sistema](./ARCHITECTURE.md)
Descripión de las capas (.NET Clean Architecture), patrones de diseño (CQRS/MediatR) y flujo de datos.

### 2. 🧩 [Modelos de Dominio](./DOMAIN_MODELS.md)
Detalles sobre los Agregados (`Event`, `User`), Entidades y reglas de negocio centrales. Incluye diagramas de clase.

### 3. 🔌 [Referencia de API y Comandos](./API_REFERENCE.md)
Mapeo de endpoints REST, comandos MediatR y estructura de DTOs.

### 4. 🎨 [Guía del Frontend](./FRONTEND_GUIDE.md)
Estructura de React/Vite, navegación, componentes premium y estilizado con Tailwind v4.

### 5. ☁️ [Infraestructura y Supabase](./INFRASTRUCTURE.md)
Detalles sobre la integración con Supabase (Auth, Funciones Edge, Postgres) y servicios de infraestructura.

---

## Cómo empezar a desarrollar
1. Clona el repositorio.
2. Configura el `appsettings.json` en el backend con tu cadena de conexión de Supabase.
3. Ejecuta `dotnet run` en la carpeta `/backend/src/Attenda.API`.
4. Ejecuta `npm install` y `npm run dev` en la carpeta `/frontend`.

---
*Documentación generada automáticamente y mantenida bajo el sistema de optimización de agentes de Attenda.*
