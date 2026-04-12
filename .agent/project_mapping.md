# Project File Mapping


This file provides a structured view of the Attenda solution to optimize navigation.


## Backend (.NET)


- **backend/**  # Core .NET solution containing API, Domain, and Application layers.
  - Attenda.sln
  - **tests/**  # Unit and Integration tests for all backend layers.
    - **Attenda.API.Tests/**
      - Attenda.API.Tests.csproj
      - UnitTest1.cs
    - **Attenda.Application.Tests/**
      - Attenda.Application.Tests.csproj
      - UnitTest1.cs
    - **Attenda.Domain.Tests/**
      - Attenda.Domain.Tests.csproj
      - UnitTest1.cs
  - **src/**  # Source code for the backend projects.
    - **Attenda.API/**  # API Layer: Controllers, Middleware, and Program Entry Point.
      - Attenda.API.csproj
      - Attenda.API.http
      - Program.cs
      - appsettings.Development.json
      - appsettings.json
      - **Middleware/**
        - ExceptionHandlingMiddleware.cs
      - **Properties/**
        - launchSettings.json
      - **Controllers/**
        - EventsController.cs
        - GuestsController.cs
    - **Attenda.Application/**  # Application layer: DTOs, Services, and Use Cases.
      - Attenda.Application.csproj
      - DependencyInjection.cs
      - **Common/**
        - **Behaviors/**
          - ValidationBehavior.cs
        - **Mappings/**
          - MappingProfile.cs
        - **Interfaces/**
          - IJwtTokenService.cs
          - IQrCodeService.cs
      - **Events/**
        - **DTOs/**
          - EventDtos.cs
        - **Commands/**
          - **CreateEvent/**
            - CreateEventCommand.cs
            - CreateEventHandler.cs
            - CreateEventValidator.cs
      - **Guests/**
        - **DTOs/**
          - GuestDtos.cs
        - **Commands/**
          - **DeleteGuests/**
            - DeleteGuestsCommand.cs
            - DeleteGuestsHandler.cs
          - **DeleteAllGuests/**
            - DeleteAllGuestsCommand.cs
            - DeleteAllGuestsHandler.cs
    - **Attenda.Domain/**  # Domain layer: Entities, Aggregates, and Value Objects (Business Logic).
      - Attenda.Domain.csproj
      - **Aggregates/**
        - **UserAggregate/**
          - User.cs
        - **EventAggregate/**
          - CheckIn.cs
          - Event.cs
          - Guest.cs
          - GuestGroup.cs
          - TaskItem.cs
      - **Enums/**
        - EventStatus.cs
        - RsvpStatus.cs
        - TaskPriority.cs
        - TaskStatus.cs
      - **Common/**
        - AggregateRoot.cs
        - Entity.cs
        - IDomainEvent.cs
        - ValueObject.cs
      - **Events/**
        - EventCreatedEvent.cs
        - GuestCheckedInEvent.cs
        - GuestRsvpConfirmedEvent.cs
      - **Interfaces/**
        - IEventRepository.cs
        - IUnitOfWork.cs
        - IUserRepository.cs
      - **ValueObjects/**
        - DietaryRestriction.cs
        - EmailAddress.cs
        - EventDate.cs
        - RsvpToken.cs
    - **Attenda.Infrastructure/**
      - Attenda.Infrastructure.csproj
      - DependencyInjection.cs
      - **Persistence/**
        - AppDbContext.cs
        - **Configurations/**
          - EventConfiguration.cs
          - GuestConfiguration.cs
          - UserConfiguration.cs
        - **Repositories/**
          - EventRepository.cs
          - UserRepository.cs
      - **Services/**
        - JwtTokenService.cs
        - QrCodeService.cs


## Frontend (React)


- **frontend/**  # React.js client application with Tailwind CSS v4.
  - .gitignore
  - README.md
  - eslint.config.js
  - index.html
  - package.json
  - vite.config.js
  - **public/**
    - favicon.svg
    - icons.svg
  - **src/**  # Source code for the backend projects.
    - App.css
    - App.jsx
    - index.css
    - main.jsx
    - **contexts/**
      - AuthContext.jsx
    - **components/**  # Reusable UI components organized by feature (Dashboard, Auth, etc.).
      - **auth/**
        - ProtectedRoute.jsx
      - **layout/**
        - Footer.jsx
        - MainLayout.jsx
        - Navbar.jsx
      - **dashboard/**
        - DashboardLayout.jsx
        - GuestDrawer.jsx
        - MobileBottomNav.jsx
        - Sidebar.jsx
        - TaskDrawer.jsx
    - **lib/**
      - supabase.js
    - **assets/**
      - hero.png
      - react.svg
      - vite.svg
    - **pages/**
      - AboutUs.jsx
      - Contact.jsx
      - ForgotPassword.jsx
      - Landing.jsx
      - Login.jsx
      - Pricing.jsx
      - Register.jsx
      - ResetPassword.jsx
      - **dashboard/**
        - CreateEvent.jsx
        - Guests.jsx
        - MyEvents.jsx
        - Overview.jsx
        - Settings.jsx
        - Tasks.jsx


## Supabase


- **supabase/**  # Database migrations, Edge Functions, and configuration for Supabase.
  - **functions/**
    - **deactivate-account/**
      - index.ts
    - **delete-account/**
      - index.ts
    - **invite-user/**
      - index.ts
    - **remove-user/**
      - index.ts

