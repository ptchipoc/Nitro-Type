*This project has been created as part of the 42 curriculum by sde-carv, ptchipoc, taguinal, mausilva, xjose.*

---

## NitroType: Real-Time Competitive Typing Platform

### Description

**NitroType** is a competitive typing platform where users can test their typing skills against each other in real-time, join an active community, participate in competitive events, and climb a global ranking ladder. The platform combines gaming mechanics with social interaction, offering a complete ecosystem for typing enthusiasts to compete, collaborate, and showcase their skills.

**Key Features:**
- Real-time multiplayer typing games with instant feedback
- Global ranking system with persistent statistics
- Community-driven features for user interaction and networking
- Event management system for tournaments and special competitions
- Comprehensive user management with profile customization
- Advanced notification system for real-time updates
- Friend system with friend requests, profiles, and online status
- Internationalization support (English, French, Portuguese)
- Responsive design optimized for all devices

---

## Prerequisites

Before running the project, ensure you have the following installed:
- **Docker** (version 20.10+)
- **Make** (GNU Make)
- **Git**

No additional setup is required. All dependencies are containerized.

---

## Instructions

### Installation & Running

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ft_transcendece
   ```

2. **Configure environment variables:**
   - Copy the `.env.example` files to `.env` files in the project root:
     ```bash
     cp .env.backend.example .env.backend
     cp .env.frontend.example .env.frontend
     ```
   - Fill in the required values (database credentials, API keys, authentication tokens, etc.)

3. **Build and run the project:**
   ```bash
   make
   ```

   This single command will:
   - Generate SSL certificates for Nginx
   - Build all Docker images (backend, frontend, database, Redis, Nginx)
   - Start all services in the proper order
   - Initialize the database with migrations

4. **Access the application:**
   - Open your browser and navigate to: `https://localhost:3000`
   - Backend API: `https://localhost/api`
   - Swagger documentation: `https://localhost/api/docs`

### Useful Commands

```bash
# View logs
make logs              # All services
make logs-backend      # Backend only
make logs-frontend     # Frontend only
make logs-postgres     # Database only
make logs-redis        # Cache/Message queue only
make logs-nginx        # Proxy only

# Database management
make db               # Open Prisma Studio

# Clean up
make clean            # Stop all containers
make fclean           # Remove all containers, volumes, and images

# Restart
make re               # Full rebuild
```

### Architecture

The application follows a monorepo structure:
```
ft_transcendece/
├── backend/           # NestJS application
│   ├── src/
│   │   ├── modules/   # Feature modules (auth, community, events, etc.)
│   │   ├── common/    # Shared utilities, guards, filters, pipes
│   │   ├── config/    # Configuration files
│   │   └── shared/    # Shared services and entities
│   ├── prisma/        # Database schema and migrations
│   └── package.json
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # App router and pages
│   │   ├── components/# UI components
│   │   ├── features/  # Feature-specific logic
│   │   ├── hooks/     # Custom hooks
│   │   └── lib/       # Utilities and helpers
│   └── package.json
├── nginx/             # Reverse proxy configuration
├── docker-compose.yml # Service orchestration
├── Makefile          # Build and run automation
└── README.md
```

---

## Team Information

| Name | Role | Responsibilities |
|------|------|-----------------|
| **sde-carv** | Project Manager (PM) | Task distribution, timeline management, team coordination via meetings, QA testing, monorepo setup, community frontend, and notification frontend contributions |
| **ptchipoc** | Frontend Developer | UI/UX implementation, component development, typing game interface, events and ranking frontend, friends frontend |
| **taguinal** | Backend Developer | Server logic, database modeling, community module, API endpoint development |
| **mausilva** | Product Owner (PO) | Product vision, feature prioritization, authentication integration, community features |
| **xjose** | Technical Lead / Architect | System architecture, authentication system, ranking implementation, friends backend, technical decisions |

**Note:** All team members actively contributed across all modules and features. The roles listed above represent primary responsibilities.

---

## Project Management

### Organization & Workflow

- **Task Distribution:** Team responsibilities were distributed during weekly planning meetings. Each sprint included feature breakdown and individual assignment.
- **Meetings:**
  - Weekly synchronization via Google Meet
  - Quick coordination and urgent decisions via WhatsApp calls
  - Ad-hoc discussions on Slack
- **Work Tracking:** Notion was used as the central hub for documentation, task tracking, and knowledge sharing
- **Code Reviews:** Critical features reviewed before merging to ensure code quality and architectural coherence

### Communication Channels

- **WhatsApp:** Primary instant communication and group calls
- **Slack:** Team updates, notifications, and quick discussions
- **Google Meet:** Weekly planning and design sessions
- **Notion:** Centralized documentation and project management

---

## Technical Stack

### Frontend
- **Framework:** Next.js 14+ with TypeScript (SSR enabled)
- **Styling:** Tailwind CSS with custom design system
- **Real-Time Communication:** WebSockets via Socket.io
- **State Management:** React Query + Context API
- **HTTP Client:** Axios for API requests
- **Internationalization:** i18next (EN, FR, PT)
- **UI Components:** Custom design system (10+ reusable components)
- **Build Tool:** Webpack (via Next.js)
- **PWA:** Service worker with offline support and installability

### Backend
- **Framework:** NestJS with TypeScript
- **API Documentation:** Swagger/OpenAPI
- **Real-Time Communication:** WebSockets via Socket.io
- **Authentication:** JWT + OAuth 2.0 (Google, GitHub, 42)
- **Database ORM:** Prisma
- **Caching:** Redis (for session management and real-time features)
- **Task Queue:** Bull (for background jobs)
- **Validation:** Class-validator + class-transformer

### Database
- **System:** PostgreSQL 16
- **Migrations:** Prisma migrations
- **Design:** Normalized schema with proper relationships and constraints

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Reverse Proxy:** Nginx (SSL/TLS termination)
- **SSL/TLS:** Self-signed certificates for local development
- **Build Automation:** Makefile

### Why These Choices?

1. **Next.js + NestJS:** Full-stack TypeScript for type safety and developer experience; Next.js also provides built-in SSR support
2. **PostgreSQL:** Reliable relational database with strong consistency guarantees for competitive rankings
3. **Nginx:** Industry-standard reverse proxy for routing and SSL termination
4. **Docker:** Environment consistency across development, testing, and potential deployment
5. **Prisma:** Type-safe ORM with excellent developer experience and automatic migrations
6. **Redis:** Fast caching layer for real-time features and session management
7. **WebSockets:** Essential for real-time typing game synchronization and collaborative features

---

## Database Schema

### Core Tables

#### Users
- `id` (UUID, PK): Unique user identifier
- `email` (VARCHAR, UNIQUE): User email
- `username` (VARCHAR, UNIQUE): Display name
- `password_hash` (VARCHAR): Hashed password
- `avatar_url` (VARCHAR): Profile image URL
- `bio` (TEXT): User biography
- `created_at` (TIMESTAMP): Account creation date
- `updated_at` (TIMESTAMP): Last profile update

#### Authentication
- `oauth_provider` (VARCHAR): OAuth provider (Google, GitHub, 42)
- `oauth_id` (VARCHAR): Provider-specific user ID
- `two_factor_enabled` (BOOLEAN): 2FA status

#### Community
- `community` table: Community groups
  - `id`, `name`, `description`, `slug`, `avatar_url`, `created_at`, `updated_at`
- `community_channel` table: Channels within communities
  - `id`, `community_id` (FK), `name`, `description`, `created_at`
- `community_channel_member` table: Channel membership
  - `id`, `channel_id` (FK), `user_id` (FK), `last_read_message_id` (FK)
- `community_message` table: Channel messages
  - `id`, `channel_id` (FK), `author_id` (FK), `content`, `created_at`

#### Friends
- `user_friendship` table: Friend relationships
  - `id`, `user_id` (FK), `friend_id` (FK), `status` (PENDING/ACCEPTED), `created_at`

#### Typing Game & Events
- `typing_session` table: Individual game sessions
  - `id`, `user_id` (FK), `duration`, `wpm`, `accuracy`, `created_at`
- `typing_match` table: Competitive matches
  - `id`, `player1_id` (FK), `player2_id` (FK), `winner_id` (FK), `status`, `created_at`, `ended_at`
- `event` table: Competitive events
  - `id`, `name`, `description`, `start_date`, `end_date`, `type`, `status`
- `event_participant` table: Event registrations
  - `id`, `event_id` (FK), `user_id` (FK), `status`, `rank`
- `event_round` table: Tournament rounds
  - `id`, `event_id` (FK), `round_number`, `status`
- `event_round_result` table: Match results per round
  - `id`, `round_id` (FK), `player1_id` (FK), `player2_id` (FK), `winner_id` (FK)

#### Ranking & Statistics
- `user_ranking` table: Global ranking data
  - `id`, `user_id` (FK, UNIQUE), `rank`, `rating`, `wins`, `losses`, `total_matches`
- `user_statistics` table: Aggregate statistics
  - `id`, `user_id` (FK, UNIQUE), `total_wpm`, `best_wpm`, `accuracy`, `games_played`, `total_time`
- `match_history` table: Historical record
  - `id`, `user_id` (FK), `opponent_id` (FK), `result` (WIN/LOSS), `timestamp`

#### Social & Notifications
- `notification` table: User notifications
  - `id`, `user_id` (FK), `type`, `content`, `related_entity_id`, `read`, `created_at`

#### System
- `migration_lock.toml`: Prisma migration lock file (prevents concurrent migrations)

### Relationships Diagram

```
User ──┬── UserRanking (1:1)
       ├── UserStatistics (1:1)
       ├── TypingSession (1:M)
       ├── TypingMatch (1:M as player)
       ├── Notification (1:M)
       ├── CommunityMessage (1:M)
       ├── UserFriendship (1:M)
       ├── Event (1:M as creator)
       └── EventParticipant (1:M)

Event ──┬── EventParticipant (1:M)
        └── EventRound (1:M)
             └── EventRoundResult (1:M)

Community ──┬── CommunityChannel (1:M)
            └── CommunityChannelMember (1:M)

CommunityChannel ├── CommunityMessage (1:M)
                 └── CommunityChannelMember (1:M)
```

---

## Features List

### Authentication & User Management
- **User Registration** (mausilva - frontend, xjose - backend)
  - Email/password authentication with secure hashing
  - Email verification via OTP

- **User Login** (mausilva - frontend, xjose - backend)
  - Persistent JWT-based sessions
  - Remember me functionality

- **OAuth 2.0 Integration** (xjose)
  - Google authentication
  - GitHub authentication
  - 42 School authentication

- **Two-Factor Authentication (2FA)** (xjose)
  - TOTP-based 2FA setup and verification
  - Recovery codes for account recovery

- **User Profile Management** (mausilva - frontend, xjose - backend)
  - Profile picture upload with image validation
  - Bio and username editing
  - Account settings and preferences

- **Organization System** (mausilva - frontend, taguinal - backend)
  - Create and manage organizations (communities)
  - Add and remove users from organizations
  - Role-based actions within organizations

### Friend System
- **Friend Requests** (xjose - backend, ptchipoc - frontend)
  - Send, accept, and decline friend requests
  - Friend list with online status indicators
  - View friend profiles

### Typing Game Experience
- **Real-Time Typing Game** (ptchipoc - frontend, xjose - backend)
  - Live multiplayer typing competition
  - Words Per Minute (WPM) calculation
  - Accuracy tracking
  - Real-time synchronization via WebSockets

- **Single-Player Practice Mode** (ptchipoc)
  - Typing challenges with various difficulty levels
  - Performance statistics

- **Multiplayer Match System** (ptchipoc - frontend, taguinal - backend)
  - 1v1 real-time matches
  - Automatic matchmaking
  - Match history and results tracking

- **3+ Player Support** (ptchipoc - frontend, taguinal - backend)
  - Multi-player tournament support
  - Fair synchronization across clients
  - Leaderboard within matches

- **Remote Players** (ptchipoc - frontend, xjose - backend)
  - Two players on separate computers playing in real-time
  - Graceful handling of network latency and disconnections
  - Reconnection logic with exponential backoff

### Community & Social Features
- **Community Groups** (mausilva - frontend, sde-carv - frontend, taguinal - backend)
  - Create and manage communities
  - Community avatars and descriptions
  - Community directory with search

- **Community Channels** (mausilva - frontend, sde-carv - frontend, taguinal - backend)
  - Channels within communities for organized discussions
  - Channel membership management
  - Read receipt tracking

- **Real-Time Messaging** (mausilva - frontend, sde-carv - frontend, taguinal - backend)
  - Instant message delivery
  - Message history
  - Typing indicators
  - Message persistence in database

- **Advanced Chat Features** (mausilva - frontend, sde-carv - frontend, taguinal - backend)
  - User presence indicators (online/offline)
  - Read receipts for messages
  - Block users from messaging
  - Direct messaging between users
  - Game invitations from chat

### Events & Tournaments
- **Event Management** (ptchipoc - frontend, xjose - backend)
  - Create events with custom rules
  - Event scheduling and time management
  - Event descriptions and rules

- **Tournament System** (xjose)
  - Bracket-style tournaments
  - Round-based progression
  - Automatic matchmaking for fairness
  - Tournament registration

- **Event Participation** (ptchipoc - frontend, xjose - backend)
  - Register for events
  - Track participation status
  - View tournament standings

### Ranking & Statistics
- **Global Ranking System** (xjose - backend, ptchipoc - frontend)
  - Dynamic ranking based on wins/losses
  - Rating system (ELO-style)
  - Leaderboard with top players

- **User Statistics** (xjose - backend, ptchipoc - frontend)
  - Lifetime WPM and accuracy statistics
  - Total games played and time invested
  - Best performance tracking
  - Match history with detailed results

- **User Analytics Dashboard** (xjose - backend, ptchipoc - frontend)
  - Personal activity insights
  - Performance trends over time

### Internationalization & Accessibility
- **Multi-Language Support** (mausilva - frontend)
  - English (EN)
  - French (FR)
  - Portuguese (PT)
  - Language switcher in UI
  - Persistent language preference

- **Responsive Design** (ptchipoc - frontend)
  - Mobile-optimized interface
  - Tablet support
  - Desktop experience
  - Touch-friendly controls

- **Browser Compatibility** (ptchipoc - frontend, sde-carv - testing)
  - Chrome (latest)
  - Firefox (latest)
  - Safari (latest)
  - Edge (latest)

### Notifications
- **Real-Time Notifications** (taguinal - backend, mausilva - frontend, sde-carv - frontend)
  - Match invitations
  - Friend requests
  - Tournament registrations
  - Event reminders
  - Message notifications

- **Notification Management** (mausilva - frontend, sde-carv - frontend)
  - Mark as read
  - Delete notifications
  - Notification preferences
  - Sound and browser notifications

### File Management
- **Profile Image Upload** (mausilva - frontend, xjose - backend)
  - Drag-and-drop interface
  - Image validation (size, format)
  - Automatic resizing
  - CDN storage

- **Community Avatars** (mausilva - frontend, taguinal - backend)
  - Upload and manage community images
  - Image preview functionality

- **Progress Indicators** (ptchipoc - frontend)
  - Upload progress display
  - Download progress for typing challenges

### Design System
- **Reusable Components** (ptchipoc, mausilva - frontend)
  1. Button (multiple variants)
  2. Input Fields (text, email, password)
  3. Card Components
  4. Modal/Dialog
  5. Navigation Bar
  6. Avatar Component
  7. Badge/Tag
  8. Progress Bar
  9. Notification Toast
  10. Dropdown Menu
  11. Ranking Table
  12. Loading Spinner

- **Design Tokens**
  - Color palette (primary, secondary, success, error, warning)
  - Typography system (headings, body, captions)
  - Spacing system (consistent margin/padding)
  - Icon library (custom SVG icons)

### Search & Filtering
- **Advanced Search** (sde-carv - testing, ptchipoc - frontend)
  - Search users by username
  - Filter communities by name/description
  - Search events by title or date range
  - Filter friends by status

- **Sorting Options** (ptchipoc - frontend)
  - Sort rankings by rating, wins, WPM
  - Sort match history by date, result, opponent
  - Sort leaderboards by various metrics

- **Pagination** (ptchipoc - frontend)
  - Implement pagination for large result sets
  - Configurable items per page

### Progressive Web App
- **PWA Support** (ptchipoc - frontend)
  - Service worker for offline support
  - Installable on desktop and mobile
  - Push notifications support
  - Fast loading with caching strategies

### Server-Side Rendering
- **SSR via Next.js** (ptchipoc - frontend)
  - Improved initial page load performance
  - Better SEO for public-facing pages
  - Hydration for interactive components

### API Documentation
- **Swagger/OpenAPI** (xjose)
  - Complete API endpoint documentation
  - Request/response schema definitions
  - Authentication requirements
  - Rate limiting information
  - Test endpoints via Swagger UI

---

## Modules & Points Breakdown

### Chosen Modules

#### IV.1 Web — 12 Points

| Module | Type | Points | Team |
|--------|------|--------|------|
| Use frameworks for frontend and backend (Next.js + NestJS) | Major | 2 | xjose, ptchipoc, mausilva, sde-carv |
| Real-time features via WebSockets | Major | 2 | xjose, ptchipoc, taguinal |
| User interaction (chat, profiles, friends) | Major | 2 | xjose, ptchipoc, mausilva, sde-carv, taguinal |
| Use an ORM for the database (Prisma) | Minor | 1 | taguinal, xjose |
| Real-time collaborative features | Minor | 1 | taguinal, mausilva, sde-carv |
| Server-Side Rendering (SSR) | Minor | 1 | ptchipoc |
| Progressive Web App (PWA) | Minor | 1 | ptchipoc |
| Custom-made design system (12+ components) | Minor | 1 | ptchipoc, mausilva |
| Advanced search with filters, sorting, pagination | Minor | 1 | ptchipoc, sde-carv |

**Web Subtotal: 12 pts**

#### IV.2 Accessibility and Internationalization — 2 Points

| Module | Type | Points | Team |
|--------|------|--------|------|
| Multiple language support (EN, FR, PT) | Minor | 1 | mausilva |
| Support for additional browsers (Firefox, Safari, Edge) | Minor | 1 | ptchipoc, sde-carv |

**Accessibility Subtotal: 2 pts**

#### IV.3 User Management — 7 Points

| Module | Type | Points | Team |
|--------|------|--------|------|
| Standard user management & authentication | Major | 2 | xjose, mausilva |
| Game statistics and match history | Minor | 1 | xjose, ptchipoc |
| OAuth 2.0 remote authentication (Google, GitHub, 42) | Minor | 1 | xjose |
| Organization system (communities) | Major | 2 | taguinal, mausilva, sde-carv |
| User activity analytics and insights dashboard | Minor | 1 | xjose, ptchipoc |

**User Management Subtotal: 7 pts**

#### IV.6 Gaming and User Experience — 6 Points

| Module | Type | Points | Team |
|--------|------|--------|------|
| Complete web-based typing game | Major | 2 | ptchipoc, xjose |
| Remote players (separate computers, real-time) | Major | 2 | ptchipoc, xjose |
| Multiplayer game (3+ players simultaneously) | Major | 2 | ptchipoc, taguinal |

**Gaming Subtotal: 6 pts**

---

### Point Summary

| Category | Points |
|----------|--------|
| Web | 12 |
| Accessibility & Internationalization | 2 |
| User Management | 7 |
| Gaming & User Experience | 6 |
| **Total Implemented** | **27** |
| **Mandatory minimum required** | **14** |
| **Bonus (capped at 5 per subject rules)** | **5** |
| **Final Score** | **19** |

The project implements 27 points worth of modules, which exceeds the mandatory 14-point requirement. The subject allows a maximum of 5 bonus points beyond the mandatory score (Chapter VII), yielding a final score of **14 mandatory + 5 bonus = 19 points**.

---

### Bonus Modules (Implemented Beyond Mandatory Requirement)

The following features were implemented additionally and contribute to the bonus score:

1. **Advanced Chat Features** — block users, game invitations from chat, typing indicators, read receipts, chat history persistence (Gaming & UX minor)
2. **Tournament System** — bracket management, round progression, automatic matchmaking (Gaming & UX minor)
3. **OAuth 2.0 / 2FA** — Google, GitHub, 42 authentication; TOTP-based two-factor authentication (User Management enhancements)
4. **Friend System with Profiles** — friend requests, friend list, online status, profile viewing

---

## Individual Contributions

### sde-carv (Project Manager)
- **Responsibilities:** Task distribution, timeline management, team coordination, monorepo setup, QA testing, frontend contributions
- **Contributions:**
  - Monorepo architecture and Docker Compose configuration
  - Nginx SSL certificate generation and reverse proxy setup
  - Comprehensive project testing and quality assurance
  - Database migration management and verification
  - Created and maintained Makefile for easy project execution
  - Coordinated weekly team meetings and tracked progress
  - Community frontend UI improvements and enhancements
  - Notification system frontend integration and development
  - Verified all features work correctly before deployment

### ptchipoc (Frontend Developer)
- **Responsibilities:** UI/UX implementation, component development, frontend features
- **Contributions:**
  - Next.js application architecture and routing setup
  - Custom design system with 12+ reusable components
  - Typing game UI and real-time WebSocket integration
  - Community channels interface with messaging
  - Ranking and leaderboard visualization
  - Events management frontend
  - Friends system frontend (friend requests, friend list, profiles)
  - Multi-language support implementation (i18next)
  - PWA configuration (service worker, offline support, installability)
  - SSR setup and optimization via Next.js
  - Cross-browser testing and compatibility fixes
  - Responsive design for mobile, tablet, and desktop

### taguinal (Backend Developer)
- **Responsibilities:** Backend logic, database modeling, API development
- **Contributions:**
  - Community module complete implementation (channels, messages, users)
  - Prisma schema design and database relationships
  - Real-time message persistence and retrieval
  - Typing match API endpoints and scoring logic
  - Event endpoints and tournament logic
  - WebSocket gateway for chat and real-time features
  - Database migration management
  - Bull queue setup for background jobs
  - Multiplayer (3+) game backend synchronization

### mausilva (Product Owner)
- **Responsibilities:** Product vision, feature prioritization, user interaction design
- **Contributions:**
  - Authentication integration with frontend API
  - User registration and login flow development
  - Community feature UI and interaction design (initial implementation)
  - Profile management and avatar upload
  - Chat interface and user experience refinement
  - Notification system frontend integration
  - Organization system frontend
  - Internationalization translations (EN, FR, PT)
  - Product feature prioritization and backlog management

### xjose (Technical Lead / Architect)
- **Responsibilities:** Technical decisions, system design, critical implementations
- **Contributions:**
  - Overall system architecture design
  - Authentication system (JWT + OAuth 2.0 + 2FA)
  - User management and RBAC implementation
  - Ranking system with ELO-style rating
  - User statistics aggregate service
  - Friend system backend (requests, acceptance, status)
  - API documentation with Swagger
  - Backend security measures (password hashing, HTTPS, rate limiting)
  - WebSocket architecture for real-time features
  - Remote player support (latency handling, reconnection logic)
  - Critical code reviews for all modules
  - TypeScript configuration and linting rules

---

## Resources

### Documentation
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Socket.io Guide](https://socket.io/docs/v4/socket-io-protocol/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)
- [FT 42 OAuth Documentation](https://docs.intra.42.fr/)
- [Next.js SSR Documentation](https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering)
- [PWA with Next.js](https://nextjs.org/docs/app/building-your-application/optimizing/progressive-web-apps)

### Tools & Libraries
- [Prisma Client](https://www.prisma.io/client/)
- [Socket.io](https://socket.io/)
- [Passport.js](http://www.passportjs.org/)
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [JWT](https://github.com/auth0/node-jsonwebtoken)
- [i18next](https://www.i18next.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)

### Learning Resources
- [Real-Time Applications with WebSockets](https://socket.io/docs/v4/)
- [Building Scalable Node.js Applications](https://nodejs.org/en/docs/guides/)
- [Understanding ELO Rating System](https://fivethirtyeight.com/features/how-we-calculate-nba-elo-ratings/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

### Project References
- Original 42 ft_transcendence subject
- Multi-player game architecture patterns
- Real-time web application best practices
- Community platform design principles

---

## AI Usage

### Tasks Where AI Was Used

1. **Documentation Generation**
   - README.md structure and content organization
   - API documentation templates
   - Database schema descriptions
   - Feature descriptions and justifications

2. **Code Pattern Suggestions**
   - NestJS module architecture patterns
   - WebSocket implementation patterns
   - Error handling strategies
   - Validation pipe implementations

3. **Configuration Files**
   - Docker Compose service configurations
   - Nginx reverse proxy configuration
   - TypeScript configuration optimization
   - Environment variable templates

4. **Testing Strategies**
   - Unit test patterns for services
   - Integration test approaches
   - API endpoint testing examples

### Parts NOT Generated by AI

- **All core business logic** (typing game mechanics, ranking calculations, authentication flows)
- **Database schema design** (custom relationships and optimizations)
- **UI component implementations** (design system components)
- **Real-time synchronization logic** (WebSocket message handling)
- **Community module backend** (message persistence, channel management)
- **Friend system** (request handling, status tracking, profile logic)

### AI as a Helper

AI was primarily used to:
- Accelerate documentation and boilerplate creation
- Suggest code patterns and best practices
- Help structure complex features
- Generate examples and templates

All AI-generated content was reviewed, tested, and significantly modified by team members to fit the project's specific requirements.

---

## Known Limitations

### Multiplayer Testing Constraints
- **Issue:** The 42 Luanda school network blocks specific ports, preventing direct peer-to-peer testing between school machines
- **Solution:** The project was temporarily deployed to Vercel (frontend) and Railway (backend) for remote multiplayer testing
- **Workaround:** All multiplayer features pass through Nginx reverse proxy on localhost for local testing
- **Impact:** Remote multiplayer functionality is fully verified but requires external deployment for school network testing

### Browser Compatibility
- **Current Support:** Chrome, Firefox, Safari, Edge (latest stable versions)
- **Known Issue:** Some animation features may be less smooth on Safari due to CSS animation handling
- **Workaround:** Progressive enhancement ensures all features work, visual polish may differ

### Real-Time Features
- **Limitation:** WebSocket connections require persistent browser connection; mobile devices may disconnect
- **Workaround:** Automatic reconnection with exponential backoff implemented

---

## Deployment

### Local Development
The project is designed for local development with Docker Compose and runs with a single `make` command.

### Production Considerations
For production deployment:
1. Use environment-specific .env files
2. Configure proper database backups
3. Set up monitoring with Prometheus/Grafana
4. Enable proper logging with ELK stack
5. Configure CDN for static assets and file uploads
6. Use managed database services (AWS RDS, Azure Database)
7. Implement proper SSL certificate management

---

## Testing

The project was tested for:
- ✅ Multi-user concurrent access
- ✅ Real-time message delivery
- ✅ Typing game synchronization
- ✅ User authentication flows
- ✅ Community features
- ✅ Ranking accuracy
- ✅ WebSocket connection stability
- ✅ Cross-browser compatibility
- ✅ Mobile responsiveness
- ✅ Friend request and management flows

---

## License

This project is part of the 42 curriculum and is provided as-is for educational purposes.

---

## Contact & Support

For questions or issues regarding this project, please contact the development team:
- **Project Manager:** sde-carv
- **Technical Lead:** xjose
- **Product Owner:** mausilva

---

**Last Updated:** May 2026

**Project Status:** ✅ Complete and Functional
