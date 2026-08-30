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


How Email Scheduling Works

When a campaign is created, it contains:

startAt
delaySeconds
hourlyLimit

For every recipient, an EmailJob is created.

The scheduled time is calculated based on the campaign start time and configured delay.

For example:

startAt = 10:00:00
delaySeconds = 10

For multiple recipients:

Recipient 1 → 10:00:00
Recipient 2 → 10:00:10
Recipient 3 → 10:00:20
Recipient 4 → 10:00:30

The jobs are added to BullMQ with the required delay.

This prevents all emails from being sent simultaneously.

💾 Persistence on Restart

Persistence is handled using PostgreSQL and Redis/BullMQ.

EmailJobs are stored in PostgreSQL before they are processed.

Therefore, the application does not rely only on JavaScript memory for scheduled email information.

The general flow is:

Create EmailJob
      ↓
Persist EmailJob in PostgreSQL
      ↓
Add job to BullMQ
      ↓
Redis stores queue state
      ↓
Worker processes job

If the API server or worker is restarted, persisted database and queue information is still available.

This allows future scheduled jobs to continue being processed instead of being lost from application memory.

🚦 Rate Limiting

Campaign-level hourly rate limiting is implemented using Redis.

Each campaign maintains a Redis counter.

Conceptually:

campaign:<campaignId>:hourly-limit

When an email is processed:

Redis INCR

increments the campaign counter.

The counter is given a one-hour expiration window.

For example, if:

hourlyLimit = 2

then:

Email 1 → Allowed
Email 2 → Allowed
Email 3 → Limit reached

The third email is prevented from being sent while the campaign has reached its configured hourly limit.

This prevents a campaign from exceeding its configured sending rate.

⚡ Concurrency

The BullMQ worker is configured with concurrency.

Example:

concurrency: 5

This means the worker can process multiple jobs concurrently instead of waiting for every previous job to finish.

Conceptually:

Job 1 ─┐
Job 2 ─┤
Job 3 ─┤──→ Worker
Job 4 ─┤
Job 5 ─┘

This improves throughput for bulk email processing while still allowing campaign-level rate limiting.

🔁 Retry Mechanism

Email jobs use BullMQ retry support.

A job can be configured with multiple attempts.

For example:

Attempt 1 → Failed
Attempt 2 → Failed
Attempt 3 → Success

Exponential backoff can be used between retry attempts.

If all attempts fail, the EmailJob is marked as:

FAILED

and the error message is persisted in PostgreSQL.

🔐 Idempotency

Email jobs use an idempotency key to help prevent accidental duplicate job creation.

The goal of idempotency is:

Repeating the same logical operation should not unintentionally result in duplicate email processing.

EmailJob records contain an idempotency-related identifier so that duplicate operations can be detected/controlled.

This is particularly useful when clients retry API requests or when bulk operations are submitted more than once.

📊 Campaign Statistics

The backend provides campaign statistics based on EmailJob status.

Example:

{
  "total": 13,
  "scheduled": 11,
  "processing": 0,
  "sent": 1,
  "failed": 1
}

These statistics are calculated from the persisted EmailJob records in PostgreSQL.

The dashboard can use these values to display campaign progress.

⏸️ Campaign Controls

Campaigns support:

ACTIVE
PAUSED
COMPLETED
CANCELLED

Available operations:

Pause
Resume
Cancel
Pause

Temporarily stops processing of jobs belonging to the campaign.

Resume

Changes the campaign back to active processing.

Cancel

Marks the campaign as cancelled and prevents further processing of cancelled campaign jobs.

📤 CSV Bulk Upload

Recipients can be uploaded using a CSV file.

Expected CSV format:

email
user1@example.com
user2@example.com
user3@example.com

The backend:

Receives the uploaded CSV.
Parses the file.
Extracts recipient email addresses.
Creates EmailJobs.
Calculates scheduled times.
Adds the jobs to BullMQ.
The worker processes them asynchronously.

Flow:

CSV
 ↓
CSV Parser
 ↓
Recipients
 ↓
EmailJobs
 ↓
BullMQ
 ↓
Redis
 ↓
Worker
 ↓
SMTP
🔑 Authentication Flow

Google OAuth authentication follows this flow:

User
 ↓
Frontend
 ↓
GET /api/auth/google
 ↓
Google OAuth
 ↓
Google Callback
 ↓
Passport Google Strategy
 ↓
Find/Create User
 ↓
Serialize User
 ↓
Session
 ↓
Dashboard

The application stores the authenticated user's information in PostgreSQL.

The dashboard displays:

Name
Email
Avatar
🔓 Logout Flow

Logout destroys the authenticated session.

Frontend
 ↓
GET /api/auth/logout
 ↓
Passport logout
 ↓
Session destroyed
 ↓
Cookie cleared
 ↓
User logged out
🔌 Important API Endpoints
Authentication
GET /api/auth/google

Starts Google authentication.

GET /api/auth/google/callback

Google OAuth callback.

GET /api/auth/getUser

Returns the currently authenticated user.

GET /api/auth/logout

Logs the user out.

Sender
POST /api/sender/create

Creates a sender.

GET /api/sender/getAll

Returns all senders.

Campaign
POST /api/campaign/create

Creates a campaign.

GET /api/campaign/getAll

Returns all campaigns.

GET /api/campaign/getOne/:id

Returns one campaign.

PATCH /api/campaign/pause/:id

Pauses a campaign.

PATCH /api/campaign/resume/:id

Resumes a campaign.

PATCH /api/campaign/cancel/:id

Cancels a campaign.

GET /api/campaign/stats/:id

Returns campaign statistics.

CSV
POST /api/campaign/csv/upload

Uploads a CSV file containing recipients.

Form-data:

campaignId → Text
file        → File
EmailJob
POST /api/emailJob/create

Creates an email job.

GET /api/emailJob/getAll

Returns all email jobs.

GET /api/emailJob/getOne/:id

Returns one email job.


how to test it 

Testing the Email Flow

A simple test can be performed using Postman.

Step 1 - Login

Open:

http://localhost:8900/api/auth/google

Authenticate with Google.

Step 2 - Create Sender
POST /api/sender/create

Example:

{
  "userId": "USER_ID",
  "name": "Test Sender",
  "email": "test@example.com",
  "smtpUser": "ETHEREAL_USERNAME",
  "smtpPassword": "ETHEREAL_PASSWORD"
}
Step 3 - Create Campaign
POST /api/campaign/create

Example:

{
  "userId": "USER_ID",
  "senderId": "SENDER_ID",
  "subject": "ReachInbox Test",
  "body": "Testing scheduled email delivery.",
  "startAt": "2026-08-30T10:00:00.000Z",
  "delaySeconds": 10,
  "hourlyLimit": 100
}
Step 4 - Create EmailJob
POST /api/emailJob/create

Example:

{
  "campaignId": "CAMPAIGN_ID",
  "recipient": "recipient@example.com"
}
Step 5 - Worker Processing

The worker terminal should show:

🚀 Email Worker started
✅ Redis connected
📨 Processing EmailJob: ...
🔄 Attempt 1/3

After successful delivery:

✅ Email sent: ...
✅ Job completed: ...

The EmailJob is then updated to:

SENT
