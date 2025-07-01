# Admin Dashboard

A modern Next.js 14 + Prisma + MySQL admin dashboard for content moderation, analytics, and user management.

## Features
- User, post, moderator, and log management
- Real-time database status and performance monitoring
- Analytics for user and post trends
- Moderator search and management
- Modern UI with Tailwind CSS
- Secure, production-ready setup

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL database

### Setup
1. Clone the repo:
   ```sh
   git clone https://github.com/your-username/admin-dashboard.git
   cd admin-dashboard
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure your environment:
   - Copy `.env.example` to `.env` and fill in your database credentials.
4. Run database migrations and seed data:
   ```sh
   npx prisma migrate deploy
   npm run seed
   ```
5. Start the development server:
   ```sh
   npm run dev
   ```

## Project Structure
- `app/` — Next.js app directory (routes, pages, API)
- `components/` — UI and dashboard components
- `lib/` — Database, types, and utility functions
- `prisma/` — Prisma schema and migrations
- `public/` — Static assets
- `scripts/` — DB and debug scripts
- `types/` — Shared TypeScript types
- `db_creation/` — SQL schema and dummy data for testing (see credits below)

## Deployment
- Vercel, Docker, or any Node.js hosting
- Set `DATABASE_URL` and other env vars in your deployment environment

## Contributing
PRs and issues welcome!

## Credits
- Database schema and dummy data in `db_creation/` are inspired by and partially sourced from [ssahibsingh/Social-Media-Database-Project](https://github.com/ssahibsingh/Social-Media-Database-Project). Please visit and star their repo!

## License
MIT
