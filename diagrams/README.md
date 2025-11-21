# CheckBus Service Class Diagrams

This directory contains PlantUML class diagrams for each microservice in the CheckBus project.

## Available Diagrams

0. **all-services-class-diagram.puml** - 🌟 **DIAGRAMME GLOBAL** - Tous les services ensemble
   - Vue d'ensemble de tous les microservices
   - Relations inter-services (REST et Kafka)
   - Principales classes de chaque service
   - Flux d'événements entre services
   - **Recommandé pour comprendre l'architecture globale**

1. **auth-service-class-diagram.puml** - Authentication Service
   - Entities: UserAuth, VerificationToken
   - Services: AuthService, EmailService, JwtUtil
   - Controllers: AuthController
   - Repositories, DTOs, Exceptions, and Config classes

2. **user-service-class-diagram.puml** - User Service
   - Entities: User
   - Services: UserService
   - Controllers: UserController
   - Repositories, DTOs, and Config classes

3. **ticket-service-class-diagram.puml** - Ticket Service
   - Entities: Ticket, TicketHistory, PaymentInfo
   - Services: TicketService, TicketHistoryService, PaymentInfoService
   - Controllers: TicketController, TicketHistoryController, PaymentInfoController
   - Repositories, DTOs, Mappers, Kafka Producers/Consumers, and Clients

4. **payment-service-class-diagram.puml** - Payment Service
   - Entities: Payment
   - Services: PaymentService
   - Controllers: PaymentController
   - Repositories, DTOs, Mappers, Kafka Producers/Consumers
   - External: Stripe integration

5. **subscription-service-class-diagram.puml** - Subscription Service
   - Entities: Subscription
   - Services: SubscriptionService, SubscriptionScheduler
   - Controllers: SubscriptionController
   - Repositories, DTOs, Clients, Kafka Producers

6. **trajet-service-class-diagram.puml** - Trajet (Route) Service
   - Entities: Trajet, Horaire
   - Services: TrajetService, HoraireService
   - Controllers: TrajetController, HoraireController
   - Repositories, DTOs, Kafka Producers

7. **geoloc-service-class-diagram.puml** - Geolocation Service
   - Entities: BusPosition
   - Services: BusPositionService, RedisPositionService, PositionScheduler
   - Controllers: BusPositionController, GeoSocketController
   - Repositories, DTOs, Kafka Producers, WebSocket Config

8. **notification-service-class-diagram.puml** - Notification Service
   - Minimal implementation (structure only)

## Diagramme Global

Le fichier **all-services-class-diagram.puml** fournit une vue d'ensemble complète de tous les services avec:
- Tous les services dans un seul diagramme
- Relations REST entre services (clients)
- Flux d'événements Kafka
- Couleurs distinctes pour chaque type de composant
- Légende explicative
- Notes sur les dépendances inter-services

**C'est le diagramme à consulter en premier pour comprendre l'architecture globale du système.**

## How to Use

### Viewing the Diagrams

1. **Online (Recommended)**:
   - Visit http://www.plantuml.com/plantuml/uml/
   - Copy and paste the content of any `.puml` file
   - The diagram will be rendered automatically

2. **VS Code Extension**:
   - Install "PlantUML" extension
   - Open any `.puml` file
   - Press `Alt+D` to preview

3. **IntelliJ IDEA**:
   - Install PlantUML plugin
   - Open any `.puml` file
   - Right-click and select "Preview PlantUML"

4. **Command Line**:
   ```bash
   # Install PlantUML (requires Java)
   # On Windows with Chocolatey:
   choco install plantuml
   
   # Generate PNG from PUML:
   plantuml diagrams/auth-service-class-diagram.puml
   ```

### Diagram Structure

Each diagram includes:
- **Entities**: JPA entities representing database tables
- **DTOs**: Data Transfer Objects for API communication
- **Controllers**: REST API endpoints
- **Services**: Business logic layer
- **Repositories**: Data access layer (JPA repositories)
- **Mappers**: Entity-DTO conversion utilities
- **Kafka Components**: Event producers and consumers
- **Clients**: REST clients for inter-service communication
- **Config**: Configuration classes (CORS, Kafka, etc.)
- **Exceptions**: Custom exception classes
- **Enums**: Enumeration types

### Relationships Shown

- **Dependencies**: `-->` (service uses)
- **Composition**: `--*` (has-a relationship)
- **Inheritance**: `--|>` (extends/implements)
- **Association**: `..>` (references)

## Notes

- All diagrams use PlantUML syntax
- Relationships show dependencies and associations
- Some services may have minimal implementations
- External services (like Stripe) are shown as external classes
- Kafka event producers/consumers are included where applicable

