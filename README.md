this is demo version of this project : https://drwsync-j3icnfbjx-snk-git-hubs-projects.vercel.app/
# DRW 
A collaborative whiteboard which have a websocket that syncs in real-time, also which has AI integrated features, like it will help to get AI assistance in your planning, or if you're solving DSA math or any logical or architecture planning, it will help or assist you by just selecting the portion with an AI lens tool with in canvas. Some of the benefits are that you don't need to take screenshots/snapshots and put them in an AI. You can get help within the Canvas itself, and it saves your time, and it also helps students or kids to ask doubts in maths or their homework. Also, it helps to solve math problems. Just check out the video below to understand how to use
: )


# Demo:

![WhatsApp Video 2025-07-31 at 6 08 51 PM](https://github.com/user-attachments/assets/15af02ff-5c48-4b04-995a-5b0669999031)

# MIND MAP:

<img width="1173" height="832" alt="image" src="https://github.com/user-attachments/assets/038614cd-e490-4e37-abb0-7cf62c021112" />



## Todo List

- [x] Add bcrypt integration  
- [ ] Validate token on frontend  
- [ ] Use cookies for authentication/session management  
- [ ] Add more shapes  
- [ ] Improve chat schema  
- [ ] Integrate RAG (Retrieval-Augmented Generation) for AI features


## Tech Stack

- **Frontend**: Next.js
- **Backend**: Node.js ,Flask
- **Real-time**: WebSocket
- **Monorepo**: Turborepo
# DRW - Local Setup Instructions

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **pnpm** (package manager)
- **Python** (for Flask backend)
- **Git**

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/snk-git-hub/Drw.git
cd Drw
```

### 2. Install Dependencies

Since this is a monorepo using pnpm workspaces, install all dependencies from the root:

```bash
pnpm install
```

### 3. Environment Setup

Create environment files for different services:

#### Frontend (.env.local in apps/web or main app directory):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8080
```

#### Backend (.env in backend directory):
```env
PORT=3001
WEBSOCKET_PORT=8080
JWT_SECRET=your_jwt_secret_key_here
DATABASE_URL=your_database_connection_string
```

### 4. Database Setup

If your project uses a database, set up the database and run any necessary migrations. Check the backend directory for specific database setup instructions.

### 5. Start Development Servers

#### Option 1: Using Turbo (Recommended)
From the root directory:

```bash
# Start all services
pnpm dev

# Or start specific apps
pnpm dev --filter=web
pnpm dev --filter=backend
```

#### Option 2: Manual Start

**Start the Backend (Node.js):**
```bash
cd apps/backend  # or wherever your backend is located
pnpm dev
# or
npm run dev
```

**Start the Flask Backend (if separate):**
```bash
cd apps/flask-backend  # adjust path as needed
python app.py
# or
flask run
```

**Start the Frontend:**
```bash
cd apps/web  # or main frontend directory
pnpm dev
# or
npm run dev
```

**Start WebSocket Server:**
```bash
cd apps/websocket  # adjust path as needed
pnpm start
# or
node server.js
```

## Docker Setup (Alternative)

If you prefer using Docker:

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build individual containers
docker build -t drw-app .
docker run -p 3000:3000 -p 3001:3001 -p 8080:8080 drw-app
```

## Access the Application

Once all servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **WebSocket**: ws://localhost:8080

## Development Workflow

### File Structure
```
Drw/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── backend/      # Node.js backend
│   └── flask/        # Flask AI services (if applicable)
├── packages/         # Shared packages
├── docker/          # Docker configuration
└── .vscode/         # VS Code settings
```

### Common Commands

```bash
# Install new dependency
pnpm add <package-name> --filter=<app-name>

# Run linting
pnpm lint

# Run tests
pnpm test

# Build for production
pnpm build

# Clean node_modules and reinstall
pnpm clean && pnpm install
```

## Features to Test

1. **Real-time Collaboration**: Open multiple browser tabs to test WebSocket synchronization
2. **AI Integration**: Test the AI lens tool by selecting portions of the canvas
3. **Authentication**: Test user registration and login (once bcrypt integration is complete)
4. **Drawing Tools**: Test various shapes and drawing tools
5. **Chat Functionality**: Test the chat feature within the canvas

## Troubleshooting

### Common Issues:

1. **Port conflicts**: Ensure ports 3000, 3001, and 8080 are available
2. **pnpm not found**: Install pnpm globally with `npm install -g pnpm`
3. **WebSocket connection failed**: Check if the WebSocket server is running on the correct port
4. **Environment variables**: Ensure all required environment variables are set

### Debug Mode:
Run with debug logs to troubleshoot issues:
```bash
DEBUG=* pnpm dev
```

## Contributing

When making changes:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request


shivanandu.k@yahoo.com






