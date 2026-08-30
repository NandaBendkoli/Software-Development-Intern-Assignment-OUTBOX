# ReachInbox - Email Scheduling & Campaign Management System

A full-stack email scheduling and campaign management application developed as part of the **Software Development Intern Assignment**.

The application provides Google OAuth authentication, sender management, campaign creation, scheduled email delivery, CSV-based bulk recipient upload, background email processing using BullMQ and Redis, retry handling, idempotency, rate limiting, concurrency, campaign statistics, and campaign controls.

---

## 📌 Project Overview

The main goal of this project is to build a reliable email scheduling system where email sending is handled asynchronously through a background job queue.

Instead of sending emails directly inside an API request, the application:

1. Stores email jobs in PostgreSQL.
2. Adds jobs to a BullMQ queue.
3. Uses Redis as the queue backend.
4. Processes jobs through a separate worker.
5. Sends emails using SMTP through Nodemailer.
6. Updates the EmailJob status in PostgreSQL.

This architecture allows email processing to continue independently from the API server and provides persistence, retries, rate limiting, and concurrent processing.

---

# 🚀 Features

## Backend Features

- Real Google OAuth authentication
- Express.js REST APIs
- PostgreSQL database
- Prisma ORM
- User management
- Sender management
- Campaign management
- EmailJob management
- Email scheduling
- CSV bulk recipient upload
- BullMQ email queue
- Redis-backed queue
- Separate background worker
- SMTP email delivery using Nodemailer
- Retry mechanism
- Idempotency support
- Campaign-level hourly rate limiting
- Worker concurrency
- Email delivery status tracking
- Campaign statistics
- Pause campaign
- Resume campaign
- Cancel campaign
- Persistent email jobs
- Error handling

## Frontend Features

- Google Login
- Authenticated dashboard
- User name display
- User email display
- User avatar
- Logout
- Campaign creation
- Sender management
- Email composition
- Scheduled email view
- Sent email view
- Failed email view
- Campaign statistics
- CSV recipient upload
- Campaign controls
- Email/job status display

---

# 🛠️ Tech Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- Axios
- React Router

## Backend

- Node.js
- TypeScript
- Express.js
- Passport.js
- Passport Google OAuth 2.0
- Express Session
- Nodemailer

## Database

- PostgreSQL
- Prisma ORM

## Queue & Background Processing

- Redis
- BullMQ
- BullMQ Worker

## Other

- Docker
- Docker Compose
- Multer
- CSV Parse

---

# 📁 Project Structure

```text
ReachInbox/
│
├── Backend/
│   │
│   ├── src/
│   │   ├── auth/
│   │   │   ├── passport.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.routes.ts
│   │   │
│   │   ├── campaign/
│   │   │   ├── campaign.controller.ts
│   │   │   ├── campaign.routes.ts
│   │   │   ├── csv.controller.ts
│   │   │   └── csv.routes.ts
│   │   │
│   │   ├── sender/
│   │   │   ├── sender.controller.ts
│   │   │   └── sender.routes.ts
│   │   │
│   │   ├── emailJob/
│   │   │   ├── emailJob.controller.ts
│   │   │   └── emailJob.routes.ts
│   │   │
│   │   ├── queue/
│   │   │   ├── email.queue.ts
│   │   │   ├── redis.connection.ts
│   │   │   └── campaign.rate-limit.ts
│   │   │
│   │   ├── config/
│   │   │   └── db.ts
│   │   │
│   │   ├── worker/
│   │   │   └── email.worker.ts
│   │   │
│   │   ├── app.ts
│   │   ├── server.ts
│   │   └── worker.ts
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── docker-compose.yml
│   ├── prisma.config.ts
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
└── README.md

```


*Prerequisites

Before running the project, make sure the following are installed:

Node.js
npm
Docker Desktop
Git

You also need:

A Google Cloud OAuth application
An SMTP/Ethereal email account
GitHub access to the repository

*Environment Variables
Create a .env file inside the Backend directory.

PORT=8900

DATABASE_URL=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_CALLBACK_URL="http://localhost:8900/api/auth/google/callback"
SESSION_SECRET=""
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465


Database Setup

PostgreSQL is used as the primary persistent database.

The project uses Prisma ORM to communicate with PostgreSQL.

The database stores:

Users
Senders
Campaigns
EmailJobs
Start PostgreSQL using Docker

From the Backend directory:

docker compose up -d

Check running containers:

docker ps

PostgreSQL should be available on:

localhost:5432
Run Prisma migrations

After configuring DATABASE_URL:

npx prisma migrate dev

Generate Prisma Client:

npx prisma generate
Prisma Studio

To visually inspect the PostgreSQL database:

npx prisma studio

Prisma Studio can be used to inspect:

Users
Senders
Campaigns
EmailJobs

Redis Setup

Redis is used by BullMQ as the backend for the email queue.

Redis is also used for campaign-level rate limiting.

The project uses Redis through Docker.

Start Redis:

docker compose up -d

Check Redis:

docker ps

Redis should be available on:

localhost:6379


Ethereal Email Setup

Ethereal Email provides a fake SMTP service useful for development and testing.

Emails sent through Ethereal are captured by Ethereal instead of being delivered to real recipients.

This makes it safe for testing the email pipeline.

Create an Ethereal Account

Visit:

https://ethereal.email/

Create an account or generate test SMTP credentials.
create a goole app password from google account for senders email

Google OAuth Setup

Google OAuth is used for real user authentication.

Create Google OAuth Credentials
Open Google Cloud Console.
Create or select a project.
Configure the OAuth consent screen.
Create OAuth 2.0 Client Credentials.
Add the local callback URL.

The callback URL used by this project is:

http://localhost:8900/api/auth/google/callback

Add this URL under the authorized redirect URIs.

Then add the generated credentials to .env:

GOOGLE_CLIENT_ID="your_client_id"

GOOGLE_CLIENT_SECRET="your_client_secret"

GOOGLE_CALLBACK_URL="http://localhost:8900/api/auth/google/callback"


Backend Setup

Navigate to the backend:

cd Backend

Install dependencies:

npm install

Configure .env.

Start Docker services:

docker compose up -d

Generate Prisma Client:

npx prisma generate

If running migrations for the first time:

npx prisma migrate dev
Run Backend API Server

From the Backend directory:

npm run dev

The backend runs on:

http://localhost:8900

Expected output:

Server running on http://localhost:8900
 Run BullMQ Worker

The worker must run separately from the API server.

Open another terminal:

cd Backend

Run:

npm run worker

Expected output:

🚀 Email Worker started
✅ Redis connected

The worker listens to the BullMQ email queue and processes email jobs in the background.

Frontend Setup

Open another terminal.

Navigate to the frontend:

cd Frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will normally run on:

http://localhost:5173


Running the Complete Application

The application requires multiple processes.

Terminal 1 - Docker

From Backend:

docker compose up -d

This starts:

PostgreSQL
Redis
Terminal 2 - Backend
cd Backend
npm run dev

Runs:

Express API
Terminal 3 - BullMQ Worker
cd Backend
npm run worker

Runs:

Email Worker
Terminal 4 - Frontend
cd Frontend
npm run dev

Runs:

React application
