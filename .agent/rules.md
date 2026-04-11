# 📏 Reglas del Agente (Attenda)

Este archivo define los estándares de comportamiento y técnicos para todos los agentes que trabajen en este proyecto.

## 👥 Colaboración por Roles
Hemos dividido el trabajo en 4 agentes especializados. Cada uno debe consultar su carpeta en `.agent/roles/` para ver sus tareas pendientes y dejar notas a otros agentes.

- **Documentation**: Orquestación y reglas globales.
- **DataBase Agent**: Esquemas, Supabase y RAG.
- **Back end developer**: C#, Clean Architecture y API.
- **Frontend Developer**: React, Tailwind v4 y UX/UI.

## 🪵 Registro y Ciclo de Actividad
- **Contexto**: Mantener actualizado `.agent/current_context.md` con los objetivos actuales. Consultarlo proactivamente para mantener el enfoque.
- **Mapeo**: Consultar `.agent/project_mapping.md` cada vez que se necesite ubicar o entender la estructura de archivos.
- **Habilidades (Daily)**: Revisar `.agent/daily_skills.md` regularmente para detectar cambios en las herramientas o flujos usados en el día.
- **Revisión de Reglas**: Si han pasado más de **2 horas** desde la última consulta de este archivo, es obligatorio volver a leer `.agent/rules.md`.
- **Dependencias entre Roles**: Si un agente detecta que necesita un cambio realizado por otro rol para avanzar, debe notificarlo escribiendo una nota clara en el archivo de tareas del orquestador: `.agent/roles/documentation/tasks.md`.
- **Commits**: Realizar commits consolidados cada 5 horas o al finalizar un hito importante, a menos que el usuario pida lo contrario.



## 🛠️ Estándares Técnicos
- **Seguridad y Datos Externos**: 
  - **REGLA CRÍTICA**: Si necesitas datos externos sensibles (contraseñas, correos, llaves de API), **DETÉN** tu proceso inmediatamente y solicítalos al usuario. NUNCA inventes o uses datos de prueba para sesiones productivas sin autorización. Evita gastar procesamiento en tareas donde los datos externos del usuario sean necesarios y falten.

- **Lectura eficiente**: Si un archivo tiene más de 500 líneas, leerlo por partes o resumirlo para ahorrar tokens (RAG optimization).

- **Aesthetics**: Diseños tipo "Concierge" (premium, animaciones suaves, glassmorphism).
- **Backend**: Clean Architecture + MediatR (CQRS).
- **Frontend**: Vite + React + Tailwind CSS v4.

## 📁 Estructura del Proyecto
- Consultar `.agent/project_mapping.md` para entender la ubicación de cada componente.

---
*Toda nueva característica debe pasar por el flujo de `/documentador`.*
