# 🎯 Klar - The Ultimate Focus Timer

<div align="center">

![Klar Logo](App/public/tauri.svg)

**A powerful, feature-rich Pomodoro timer with OAuth authentication, floating widgets, and comprehensive task management - built with Tauri v2, React, Rust, and Spring Boot.**

[![Tauri](https://img.shields.io/badge/Tauri-v2-blue?style=for-the-badge&logo=tauri)](https://tauri.app/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.4-6DB33F?style=for-the-badge&logo=spring)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk)](https://openjdk.org/)
[![Rust](https://img.shields.io/badge/Rust-Latest-000000?style=for-the-badge&logo=rust)](https://www.rust-lang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

## ✨ Features

### 🚀 **Core Timer Functionality**
- **Pomodoro Technique Integration**: 25-minute focus sessions with customizable break intervals
- **Advanced Timer Controls**: Start, pause, stop, and resume with smooth transitions
- **Visual Progress Tracking**: Beautiful circular progress indicator with real-time updates
- **Break Management**: Automatic break detection with missed/taken break statistics
- **Session Persistence**: Maintains timer state across app restarts

### 🔐 **Authentication & Sync**
- **OAuth2 Integration**: Seamless login with GitHub and Google
- **JWT Token Management**: Secure authentication with automatic token refresh
- **Cross-Device Sync**: Tasks and statistics synchronized across all your devices
- **Offline Mode**: Full functionality without authentication for local use
- **Session Management**: Persistent login state with secure token storage

### 📋 **Task Management**
- **Intelligent Task System**: Create, edit, toggle, and delete tasks with instant sync
- **Real-time Statistics**: Track completion rates, focus time, and productivity metrics
- **Local Storage Fallback**: Tasks persist locally when offline
- **Task-Session Linking**: Associate timer sessions with specific tasks
- **Completion Tracking**: Visual progress indicators and percentage calculations

### 🎨 **System-Wide Widgets**
- **Floating Timer Widget**: Always-on-top timer with drag functionality
- **Tasks Widget**: Compact task overview with quick actions
- **Multi-Window Architecture**: Independent widget windows for maximum flexibility
- **Window State Management**: Automatic positioning and restoration
- **Event-Driven Updates**: Real-time synchronization between main app and widgets

### 🎭 **Modern UI/UX**
- **Dark/Light Theme Support**: Automatic system theme detection with manual override
- **Tailwind CSS**: Modern, responsive design with smooth animations
- **Lucide Icons**: Crisp, consistent iconography throughout the interface
- **Glassmorphism Effects**: Beautiful backdrop blur and transparency effects
- **Responsive Layout**: Optimized for all screen sizes and resolutions

### 📊 **Analytics & Insights**
- **Daily Focus Statistics**: Track total focus time, breaks taken, and missed breaks
- **Session History**: Complete log of all pomodoro sessions with timestamps
- **Productivity Metrics**: Detailed insights into your work patterns
- **Visual Progress**: Real-time charts and completion percentages
- **Export Capabilities**: Data export for external analysis

## 🔧 Tech Stack

### Frontend (Desktop App)
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.6.2** - Type-safe JavaScript for better development experience
- **Tailwind CSS 4.1.11** - Utility-first CSS framework with custom theming
- **Vite 6.0.3** - Lightning-fast build tool and dev server
- **Lucide React** - Beautiful, customizable icon library

### Desktop Runtime
- **Tauri v2** - Secure, lightweight desktop app framework
- **Rust** - Memory-safe systems programming language
- **Tokio** - Asynchronous runtime for concurrent operations
- **Serde** - High-performance serialization framework

### Backend API (Server)
- **Spring Boot 3.5.4** - Enterprise-grade Java framework
- **Java 21** - Latest LTS version with modern language features
- **Spring Security OAuth2** - Comprehensive authentication and authorization
- **Spring Data MongoDB** - NoSQL database integration
- **Spring Web** - RESTful API development
- **JWT (jsonwebtoken)** - Stateless token-based authentication
- **SpringDoc OpenAPI** - API documentation and testing interface
- **MongoDB** - Document-based NoSQL database for flexible data storage

### Authentication & Security
- **OAuth2 Integration** - GitHub and Google provider support
- **JWT Tokens** - Stateless authentication with secure token management
- **Spring Security** - Enterprise-grade security framework
- **CORS Configuration** - Cross-origin resource sharing for web clients

### Build & Development
- **TypeScript Compiler** - Static type checking and modern JS features
- **Tauri CLI** - Development tools and build system
- **npm/pnpm** - Package management and dependency resolution
- **Gradle** - Java build automation and dependency management
- **Cross-platform compilation** - Windows, macOS, and Linux support

## 🚀 Quick Start

### Prerequisites

#### For Desktop App (Frontend)
```bash
# Node.js 18+ and npm
node --version  # Should be 18.0.0 or higher
npm --version

# Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustc --version

# Tauri CLI
npm install -g @tauri-apps/cli@next
# or
cargo install tauri-cli --version "^2.0.0"
```

#### For Backend API (Server)
```bash
# Java 21 (LTS)
java --version  # Should be 21.0.0 or higher

# Gradle (included via wrapper)
./gradlew --version

# MongoDB (for data persistence)
# Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
# Or use MongoDB Atlas cloud service
```

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/mitja-kurath/klar.git
cd klar
```

#### 2. Backend Setup (Spring Boot Server)
```bash
# Navigate to server directory
cd Server

# Set up environment variables (optional)
# Create application.properties or application.yml with your MongoDB connection
# and OAuth2 client credentials

# Run the server
./gradlew bootRun

# Or build and run the JAR
./gradlew build
java -jar build/libs/klar-0.0.1-SNAPSHOT.jar

# Server will start at http://localhost:8080
# API documentation available at http://localhost:8080/swagger-ui.html
```

#### 3. Frontend Setup (Tauri Desktop App)
```bash
# Navigate to app directory
cd ../App

# Install dependencies
npm install

# Configure API endpoint (if using custom backend)
# Create .env file with VITE_API_BASE_URL=http://localhost:8080/api

# Start development server
npm run tauri dev
```

### Build for Production

#### Backend (Spring Boot)
```bash
cd Server

# Build executable JAR
./gradlew build

# The built JAR will be in build/libs/
# Run with: java -jar build/libs/klar-0.0.1-SNAPSHOT.jar
```

#### Frontend (Tauri Desktop App)
```bash
cd App

# Build the application
npm run tauri build

# The built application will be in src-tauri/target/release/
```

## 📖 Usage Guide

### 🎯 **Getting Started**

1. **Launch Klar** - Start the application from your desktop
2. **Sign In** - Use GitHub or Google OAuth for cloud sync (optional)
3. **Set Your Task** - Enter what you want to focus on
4. **Start Timer** - Click play to begin your 25-minute focus session
5. **Take Breaks** - Follow the Pomodoro technique with automatic break reminders

### 🎛️ **Advanced Features**

#### **Floating Widgets**
- Create system-wide floating timer and task widgets
- Drag widgets anywhere on your screen
- Widgets stay on top of all other applications
- Independent of main application window

#### **Task Management**
- Add tasks with instant cloud sync
- Mark tasks as complete with visual feedback
- Remove completed tasks to maintain focus
- Track completion percentages in real-time

#### **Statistics Tracking**
- View daily focus time accumulation
- Monitor break compliance and patterns
- Export data for productivity analysis
- Historical session logging

## ⚙️ Configuration

### Frontend Environment Variables

Create a `.env` file in the `App/` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# OAuth Configuration (for OAuth flow)
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Development
VITE_ENV=development
```

### Backend Configuration

Create an `application.properties` file in `Server/src/main/resources/`:

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/

# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/klar
# Or for MongoDB Atlas:
# spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/klar

# OAuth2 Configuration - GitHub
spring.security.oauth2.client.registration.github.client-id=${GITHUB_CLIENT_ID:your_github_client_id}
spring.security.oauth2.client.registration.github.client-secret=${GITHUB_CLIENT_SECRET:your_github_client_secret}
spring.security.oauth2.client.registration.github.scope=user:email

# OAuth2 Configuration - Google
spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID:your_google_client_id}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET:your_google_client_secret}
spring.security.oauth2.client.registration.google.scope=openid,profile,email

# JWT Configuration
jwt.secret=${JWT_SECRET:your-256-bit-secret-key-here-make-it-long-and-secure}
jwt.expiration=86400000

# CORS Configuration
cors.allowed-origins=tauri://localhost,http://localhost:1420,http://localhost:3000

# Logging
logging.level.ch.mitjakurath.klar=DEBUG
logging.level.org.springframework.security=DEBUG
```

### Timer Settings

Customize your Pomodoro intervals in the settings panel:

- **Work Duration**: 25 minutes (default)
- **Short Break**: 5 minutes
- **Long Break**: 15 minutes
- **Sessions Before Long Break**: 4

### Theme Configuration

Klar supports multiple themes:

- **System** - Follows your OS theme preference
- **Light** - Clean, bright interface
- **Dark** - Easy on the eyes for long work sessions

## 🏗️ Architecture

### Project Structure

```
klar/
├── App/                     # Tauri Desktop Application
│   ├── src/                 # React frontend source
│   │   ├── components/      # Reusable UI components
│   │   │   ├── widgets/     # Floating widget components
│   │   │   └── TasksSidebar/ # Task management components
│   │   ├── contexts/        # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API and external services
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── src-tauri/           # Rust backend source
│   │   ├── src/             # Rust source code
│   │   ├── capabilities/    # Tauri security capabilities
│   │   ├── icons/           # Application icons
│   │   └── target/          # Rust build artifacts
│   ├── public/              # Static assets
│   └── dist/                # Built frontend (generated)
└── Server/                  # Spring Boot API Server
    ├── src/main/java/       # Java source code
    │   └── ch/mitjakurath/klar/
    │       ├── Application.java      # Main Spring Boot application
    │       ├── config/              # Configuration classes
    │       ├── controller/          # REST API controllers
    │       │   ├── AuthController.java
    │       │   ├── TaskController.java
    │       │   ├── SessionController.java
    │       │   └── SettingsController.java
    │       ├── model/               # Data models/entities
    │       │   ├── User.java
    │       │   ├── Task.java
    │       │   ├── PomodoroSession.java
    │       │   └── UserSettings.java
    │       ├── repository/          # Data access layer
    │       ├── service/             # Business logic layer
    │       └── util/                # Utility classes
    ├── src/main/resources/  # Configuration files
    ├── build/               # Build artifacts
    └── gradle/              # Gradle wrapper
```

### System Architecture

```mermaid
graph TB
    subgraph "Desktop Application (Tauri)"
        UI[React Frontend]
        RUST[Rust Backend]
        WIDGETS[Floating Widgets]
        UI --> RUST
        RUST --> WIDGETS
    end
    
    subgraph "API Server (Spring Boot)"
        API[REST Controllers]
        SERVICE[Business Services]
        REPO[Repositories]
        AUTH[OAuth2 Security]
        API --> SERVICE
        SERVICE --> REPO
        AUTH --> API
    end
    
    subgraph "External Services"
        GITHUB[GitHub OAuth]
        GOOGLE[Google OAuth]
        MONGO[(MongoDB)]
    end
    
    UI --> API
    AUTH --> GITHUB
    AUTH --> GOOGLE
    REPO --> MONGO
```

### Component Architecture

```mermaid
graph TD
    A[App.tsx] --> B[AuthProvider]
    A --> C[ThemeProvider]
    B --> D[LoginScreen]
    B --> E[AppContent]
    E --> F[StatusBar]
    E --> G[TimerCircle]
    E --> H[TimerControls]
    E --> I[TasksSidebar]
    E --> J[WidgetService]
    J --> K[TimerWidget]
    J --> L[TasksWidget]
```

### Data Flow

1. **Authentication**: OAuth providers → Spring Security → JWT tokens → Frontend authentication state
2. **Timer State**: React hooks → Tauri commands → Rust state management → Local persistence
3. **Task Management**: React components → API service → Spring Boot controllers → MongoDB → Real-time sync
4. **Widget Communication**: Event system → Inter-window messaging → State synchronization
5. **Session Tracking**: Timer completion → API endpoints → Database storage → Statistics computation

## 🛠️ Development

### Setting Up Development Environment

#### Frontend Development
```bash
cd App

# Install development dependencies
npm install

# Start the development server
npm run dev

# In another terminal, start Tauri dev mode
npm run tauri dev

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run type-check
```

#### Backend Development
```bash
cd Server

# Run in development mode with auto-reload
./gradlew bootRun

# Run tests
./gradlew test

# Check code formatting
./gradlew spotlessCheck

# Apply code formatting
./gradlew spotlessApply

# Generate API documentation
./gradlew bootRun
# Then visit http://localhost:8080/swagger-ui.html
```

### API Endpoints

The Spring Boot server provides the following REST API endpoints:

#### Authentication
- `POST /api/auth/oauth2/github` - GitHub OAuth authentication
- `POST /api/auth/oauth2/google` - Google OAuth authentication
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

#### Tasks Management
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PUT /api/tasks/{id}/toggle` - Toggle task completion

#### Pomodoro Sessions
- `GET /api/sessions` - Get user's session history
- `POST /api/sessions` - Record new pomodoro session
- `GET /api/sessions/stats` - Get session statistics
- `GET /api/sessions/today` - Get today's sessions

#### User Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings

### Adding New Features

#### Frontend (React/TypeScript)
1. **Components**: Add React components in `App/src/components/`
2. **Tauri Commands**: Implement Tauri commands in `App/src-tauri/src/lib.rs`
3. **API Integration**: Extend services in `App/src/services/`
4. **Type Safety**: Update interfaces in `App/src/types/`

#### Backend (Spring Boot/Java)
1. **Models**: Add data models in `Server/src/main/java/.../model/`
2. **Controllers**: Create REST endpoints in `Server/src/main/java/.../controller/`
3. **Services**: Implement business logic in `Server/src/main/java/.../service/`
4. **Repositories**: Add data access in `Server/src/main/java/.../repository/`

### Building Widgets

Widgets are independent Tauri windows that communicate with the main app:

```typescript
// Create a new widget
await widgetService.createTimerWidget();

// Update widget data
await widgetService.updateTimerWidget({
  timeLeft: 1500,
  isActive: true,
  isPaused: false,
  isBreak: false,
  currentTask: "Focus Session"
});

// Close widget
await widgetService.closeTimerWidget();
```

### Rust Command Implementation

```rust
#[tauri::command]
async fn your_command(
    state: State<'_, AppState>,
    app: tauri::AppHandle
) -> Result<YourReturnType, String> {
    // Implementation
    Ok(result)
}
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Test Rust code
cd src-tauri && cargo test
```

### Testing Strategy

- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API and service integration testing
- **E2E Tests**: Full application workflow testing
- **Rust Tests**: Backend logic and command testing

## 📦 Building & Distribution

### Development Build

```bash
npm run tauri dev
```

### Production Build

```bash
# Build for current platform
npm run tauri build

# Build for specific platform
npm run tauri build -- --target x86_64-pc-windows-msvc
```

### Distribution

The built application will be available in:
- `src-tauri/target/release/` - Executable files
- `src-tauri/target/release/bundle/` - Platform-specific installers

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Contribution Guidelines

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Follow the configured linting rules
- **Prettier**: Code formatting enforced
- **Conventional Commits**: Use conventional commit messages

### Development Workflow

```bash
# Install pre-commit hooks
npm run prepare

# Run linting and formatting
npm run lint:fix
npm run format

# Run type checking
npm run type-check

# Run tests before committing
npm test
```

## 🐛 Troubleshooting

### Common Issues

#### **Build Errors**

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Tauri cache
npm run tauri build -- --config-clear-cache
```

#### **Widget Windows Not Appearing**

1. Check if widgets are enabled in security capabilities
2. Verify widget service initialization
3. Check console for JavaScript errors

#### **Authentication Issues**

1. Verify OAuth provider configuration
2. Check network connectivity
3. Clear browser/app cache and localStorage

#### **Timer Sync Issues**

1. Restart the application
2. Check widget communication logs
3. Verify Tauri command registration

### Debug Mode

Enable debug logging:

```bash
# Set environment variable
export RUST_LOG=debug

# Or in .env file
RUST_LOG=debug
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Pomodoro Technique** - Francesco Cirillo for the time management method
- **Tauri Team** - For the amazing desktop app framework
- **React Team** - For the excellent frontend library
- **Rust Community** - For the powerful systems programming language
- **Contributors** - Everyone who has contributed to making Klar better

## 📞 Support

- **Documentation**: [Wiki](https://github.com/mitja-kurath/klar/wiki)
- **Issues**: [GitHub Issues](https://github.com/mitja-kurath/klar/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mitja-kurath/klar/discussions)
- **Email**: contact@mitjakurath.ch

---

<div align="center">

**Made with ❤️ by Mitja Kurath**

[⭐ Star this repository](https://github.com/mitja-kurath/klar) if you find it helpful!

</div>
