# SQL Assistant

A SQL query assistant that helps users write, optimise, and understand SQL queries through natural language interaction.

<https://sql-assistant.netlify.app/> [![Netlify Status](https://api.netlify.com/api/v1/badges/5c3dc2cc-29ea-4400-b80d-9d59c731c61b/deploy-status)](https://app.netlify.com/projects/sql-assistant/deploys)

## Features

- Natural language to SQL query 
- SQL query optimisation suggestions
- Query explanation and documentation
- Query history and management

## Project Structure

``` sql-assistant/
├── client/           # Frontend application
├── server/           # Backend API and services
└── .github/          # GitHub workflows and configurations
```

## Prerequisites

- Node.js (v18 or higher)
- Docker

## Getting Started

1. Clone the repository:

   ``` bash

   git clone https://github.com/efe-osa/sql-assistant.git
   cd sql-assistant
   ```

2. Install dependencies:

   ``` bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in server directories
   - Update the environment variables with your configuration

4. Start the development servers:

   ``` bash
   # Start the backend server
   cd server
   cp .env.example .env.development
   npm run dev

   # Start the frontend development server
   cd ../client
   echo "VITE_API_URL=http://localhost:3001/api" >> .env.development
   npm run dev
   ```

## Docker Deployment

To run the application using Docker:

```bash
docker-compose up --build
```

## Development

- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: SQLite3
- Containerization: Docker

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
